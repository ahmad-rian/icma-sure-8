<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\AbstractSubmission;
use App\Models\SubmissionPayment;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    /**
     * Display user's submissions
     */
    public function index(): Response
    {
        $submissions = AbstractSubmission::with([
            'contributors.country',
            'country',
            'payment',
            'reviewer'
        ])
        ->where('user_id', Auth::id())
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('User/Submissions/Index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show the form for creating a new submission
     */
    public function create(): Response
    {
        $countries = Country::orderBy('name')->get();

        return Inertia::render('User/Submissions/Create', [
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created submission
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string|max:500',
            'submission_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            // Author validation (required)
            'author.first_name' => 'required|string|max:255',
            'author.last_name' => 'required|string|max:255',
            'author.email' => 'required|email|max:255',
            'author.phone_number' => 'required|string|max:20',
            'author.affiliation' => 'required|string|max:255',
            'author.country_id' => 'required|exists:countries,id',
            // Contributors validation (optional)
            'contributors' => 'nullable|array',
            'contributors.*.first_name' => 'required|string|max:255',
            'contributors.*.last_name' => 'required|string|max:255',
            'contributors.*.email' => 'required|email|max:255',
            'contributors.*.phone_number' => 'required|string|max:20',
            'contributors.*.affiliation' => 'required|string|max:255',
            'contributors.*.country_id' => 'required|exists:countries,id',
            'contributors.*.role' => 'required|in:author,co-author',
            'contributors.*.is_primary_contact' => 'nullable|boolean',
        ]);

        $submission = DB::transaction(function () use ($request) {
            // Handle file upload
            $submissionFilePath = null;
            if ($request->hasFile('submission_file')) {
                $submissionFilePath = $request->file('submission_file')
                    ->store('submissions/' . Auth::id(), 'public');
            }

            // Create submission
            $submission = AbstractSubmission::create([
                'user_id' => Auth::id(),
                'country_id' => $request->author['country_id'],
                'author_first_name' => $request->author['first_name'],
                'author_last_name' => $request->author['last_name'],
                'author_email' => $request->author['email'],
                'author_phone_number' => $request->author['phone_number'],
                'author_affiliation' => $request->author['affiliation'],
                'title' => $request->title,
                'abstract' => $request->abstract,
                'keywords' => $request->keywords,
                'submission_file' => $submissionFilePath,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            // Only create contributors if explicitly provided
            // Author information is stored in the submission record itself

            // Create additional contributors if any
            if ($request->has('contributors') && is_array($request->contributors)) {
                foreach ($request->contributors as $contributorData) {
                    $submission->contributors()->create($contributorData);
                }
            }

            return $submission;
        });

        return redirect()->route('user.submissions.index')
            ->with('success', 'Abstract submission berhasil dikirim dan sedang menunggu review.');
    }

    /**
     * Display the specified submission
     */
    public function show(AbstractSubmission $submission): Response
    {
        // Ensure user can only view their own submissions
        if ($submission->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke submission ini.');
        }

        $submission->load([
            'user.profile.country',
            'contributors.country',
            'country',
            'payment'
        ]);

        return Inertia::render('User/Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show upload payment form
     */
    public function showUploadPayment(AbstractSubmission $submission)
    {
        // Ensure user can only access their own submission
        if ($submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to submission.');
        }

        // Check if submission is approved
        if ($submission->status !== 'approved') {
            return redirect()->route('user.submissions.show', $submission)
                ->with('error', 'Payment hanya dapat diupload untuk submission yang sudah disetujui.');
        }

        // Load submission with relationships
        $submission->load(['user.profile', 'contributors', 'payment', 'country']);

        return Inertia::render('User/Submissions/UploadPayment', [
            'submission' => $submission,
        ]);
    }

    /**
     * Upload payment proof
     */
    public function uploadPayment(Request $request, AbstractSubmission $submission)
    {
        // Ensure user can only upload payment for their own submissions
        if ($submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to submission.');
        }

        // Check if submission is approved
        if ($submission->status !== 'approved') {
            return redirect()->back()
                ->with('error', 'Payment hanya dapat diupload untuk submission yang sudah disetujui.');
        }

        $request->validate([
            'payment_proof' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'payment_amount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request, $submission) {
            // Ensure payment proof file exists
            if (!$request->hasFile('payment_proof')) {
                throw new \Exception('Payment proof file is required.');
            }

            // Handle payment proof upload
            $paymentProofPath = $request->file('payment_proof')
                ->store('payments/' . Auth::id(), 'public');

            // Ensure the file was uploaded successfully
            if (!$paymentProofPath) {
                throw new \Exception('Failed to upload payment proof file.');
            }

            // Create or update payment record
            SubmissionPayment::updateOrCreate(
                ['submission_id' => $submission->id],
                [
                    'payment_proof' => $paymentProofPath,
                    'amount' => $request->payment_amount,
                    'status' => 'pending',
                    'uploaded_at' => now(),
                ]
            );
        });

        // Refresh the submission with all relations after payment upload
        $submission->refresh();
        $submission->load([
            'user.profile.country',
            'contributors.country',
            'country',
            'payment'
        ]);

        return redirect()->route('user.submissions.show', $submission)
            ->with('success', 'Bukti pembayaran berhasil diupload dan sedang menunggu verifikasi.');
    }

    /**
     * Download submission PDF
     */
    public function downloadPdf(AbstractSubmission $submission)
    {
        // Ensure user can only download their own submission PDF
        if ($submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to submission.');
        }

        if (!$submission->abstract_pdf) {
            return redirect()->back()
                ->with('error', 'PDF belum tersedia untuk submission ini.');
        }

        $fullPath = storage_path('app/public/abstracts/' . $submission->abstract_pdf);

        if (!file_exists($fullPath)) {
            return redirect()->back()
                ->with('error', 'File PDF tidak ditemukan.');
        }

        return response()->download($fullPath, $submission->abstract_pdf);
    }

    /**
     * Download LOA (Letter of Acceptance)
     * Note: LOA is sent via email automatically when payment is approved
     */
    public function downloadLoa(AbstractSubmission $submission)
    {
        // Ensure user can only access their own submission
        if ($submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to submission.');
        }

        // Check if payment is approved
        if (!$submission->payment || $submission->payment->status !== 'approved') {
            return redirect()->back()
                ->with('error', 'LOA hanya tersedia setelah pembayaran disetujui.');
        }

        // LOA is sent via email automatically, redirect back with info
        return redirect()->back()
            ->with('info', 'Letter of Acceptance (LOA) telah dikirim melalui email setelah pembayaran disetujui. Silakan cek email Anda.');
    }

    /**
     * View payment proof file
     */
    public function viewPaymentProof(AbstractSubmission $submission)
    {
        // Ensure user can only view their own submission payment proof
        if ($submission->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to submission.');
        }

        // Check if payment proof exists
        if (!$submission->payment || !$submission->payment->payment_proof) {
            return redirect()->back()
                ->with('error', 'Payment proof tidak ditemukan.');
        }

        $fullPath = storage_path('app/public/' . $submission->payment->payment_proof);

        if (!file_exists($fullPath)) {
            return redirect()->back()
                ->with('error', 'File payment proof tidak ditemukan.');
        }

        return response()->file($fullPath);
    }
}