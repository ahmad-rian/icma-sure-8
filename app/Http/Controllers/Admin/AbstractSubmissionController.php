<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbstractSubmission;
use App\Models\SubmissionPayment;
use App\Models\EmailNotification;
use App\Models\User;
use App\Models\Country;
use App\Services\PdfGenerationService;
use App\Jobs\SendEmailNotificationJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AbstractSubmissionController extends Controller
{
    /**
     * Display a listing of abstract submissions
     */
    public function index(Request $request): Response
    {
        $query = AbstractSubmission::with([
            'user.profile.country',  // Load user's profile country
            'contributors.country',   // Load contributors' countries
            'country',               // Load submission country
            'payment.reviewer',      // Load payment and reviewer info
            'reviewer'               // Load reviewer directly
        ]);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('abstract', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('contributors', function ($contributorQuery) use ($search) {
                        $contributorQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Sort by submitted date (newest first)
        $query->orderBy('submitted_at', 'desc');

        $submissions = $query->paginate(15)->withQueryString();

        // Get statistics
        $stats = [
            'total' => AbstractSubmission::count(),
            'pending' => AbstractSubmission::where('status', 'pending')->count(),
            'approved' => AbstractSubmission::where('status', 'approved')->count(),
            'rejected' => AbstractSubmission::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/AbstractSubmissions/Index', [
            'submissions' => $submissions,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new abstract submission
     */
    public function create(): Response
    {
        $users = User::with('profile.country')->get();
        $countries = Country::orderBy('name')->get();

        return Inertia::render('Admin/AbstractSubmissions/Create', [
            'users' => $users,
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created abstract submission
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'country_id' => 'required|exists:countries,id',
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string|max:500',
            'registration_fee' => 'nullable|numeric|min:0',
            'payment_required' => 'nullable|boolean',
            'contributors' => 'nullable|array',
            'contributors.*.first_name' => 'required|string|max:255',
            'contributors.*.last_name' => 'required|string|max:255',
            'contributors.*.email' => 'required|email|max:255',
            'contributors.*.affiliation' => 'required|string|max:255',
            'contributors.*.country_id' => 'required|exists:countries,id',
        ]);

        $submission = DB::transaction(function () use ($request) {
            // Get user data for author information
            $user = User::with('profile')->find($request->user_id);
            
            // Create submission
            $submission = AbstractSubmission::create([
                'user_id' => $request->user_id,
                'country_id' => $request->country_id,
                'author_first_name' => $user->profile->first_name ?? '',
                'author_last_name' => $user->profile->last_name ?? '',
                'author_email' => $user->email,
                'author_affiliation' => $user->profile->affiliation ?? '',
                'title' => $request->title,
                'abstract' => $request->abstract,
                'keywords' => $request->keywords,
                'registration_fee' => $request->registration_fee ?? 0,
                'payment_required' => $request->payment_required ?? false,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            // Create contributors if provided
            if ($request->contributors && count($request->contributors) > 0) {
                foreach ($request->contributors as $contributorData) {
                    $submission->contributors()->create($contributorData);
                }
            }

            // Generate PDF automatically
            $pdfService = new PdfGenerationService();
            $pdfPath = $pdfService->generateAbstractPdf($submission);

            // Update submission with PDF path
            $submission->update(['abstract_pdf' => $pdfPath]);

            return $submission;
        });

        return redirect()->route('admin.abstract-submissions.index')
            ->with('success', 'Abstract submission berhasil dibuat.');
    }

    /**
     * Display the specified abstract submission
     */
    public function show(AbstractSubmission $submission): Response
    {
        $submission->load([
            'user.profile.country',
            'contributors.country',
            'country',
            'payment.reviewer',
            'reviewer',
            'emailNotifications.sender'
        ]);

        return Inertia::render('Admin/AbstractSubmissions/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show the form for editing the specified abstract submission
     */
    public function edit(AbstractSubmission $submission): Response
    {
        $submission->load([
            'user.profile.country',
            'contributors.country',
            'country'
        ]);
        $users = User::with('profile.country')->get();
        $countries = Country::orderBy('name')->get();

        return Inertia::render('Admin/AbstractSubmissions/Edit', [
            'submission' => $submission,
            'users' => $users,
            'countries' => $countries,
        ]);
    }

    /**
     * Update the specified abstract submission
     */
    public function update(Request $request, AbstractSubmission $submission)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'country_id' => 'required|exists:countries,id',
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string|max:500',
            'registration_fee' => 'nullable|numeric|min:0',
            'payment_required' => 'nullable|boolean',
            'contributors' => 'nullable|array',
            'contributors.*.first_name' => 'required|string|max:255',
            'contributors.*.last_name' => 'required|string|max:255',
            'contributors.*.email' => 'required|email|max:255',
            'contributors.*.affiliation' => 'required|string|max:255',
            'contributors.*.country_id' => 'required|exists:countries,id',
        ]);

        DB::transaction(function () use ($request, $submission) {
            // Get user data for author information
            $user = User::with('profile')->find($request->user_id);
            
            // Update submission
            $submission->update([
                'user_id' => $request->user_id,
                'country_id' => $request->country_id,
                'author_first_name' => $user->profile->first_name ?? '',
                'author_last_name' => $user->profile->last_name ?? '',
                'author_email' => $user->email,
                'author_affiliation' => $user->profile->affiliation ?? '',
                'title' => $request->title,
                'abstract' => $request->abstract,
                'keywords' => $request->keywords,
                'registration_fee' => $request->registration_fee ?? $submission->registration_fee,
                'payment_required' => $request->payment_required ?? $submission->payment_required,
            ]);

            // Update contributors
            $submission->contributors()->delete();
            if ($request->contributors && count($request->contributors) > 0) {
                foreach ($request->contributors as $contributorData) {
                    $submission->contributors()->create($contributorData);
                }
            }

            // Regenerate PDF automatically
            $pdfService = new PdfGenerationService();
            $pdfPath = $pdfService->regenerateAbstractPdf($submission);

            // Update submission with new PDF path
            $submission->update(['abstract_pdf' => $pdfPath]);
        });

        return redirect()->route('admin.abstract-submissions.index')
            ->with('success', 'Abstract submission berhasil diperbarui.');
    }

    /**
     * Remove the specified abstract submission
     */
    public function destroy(AbstractSubmission $submission)
    {
        DB::transaction(function () use ($submission) {
            // Delete PDF file if exists
            if ($submission->abstract_pdf) {
                $pdfService = new PdfGenerationService();
                $pdfService->deletePdf($submission->abstract_pdf);
            }

            // Delete related records
            $submission->contributors()->delete();
            if ($submission->payment) {
                $submission->payment->delete();
            }

            // Delete submission
            $submission->delete();
        });

        return redirect()->route('admin.abstract-submissions.index')
            ->with('success', 'Abstract submission berhasil dihapus.');
    }

    /**
     * Generate and download PDF for abstract submission
     */
    public function downloadPdf(AbstractSubmission $submission)
    {
        // Load the submission with relationships
        $submission->load([
            'user.profile.country',
            'contributors.country',
            'country',
            'reviewer'
        ]);

        // Generate PDF if not exists
        $pdfService = new PdfGenerationService();
        if (!$submission->abstract_pdf) {
            $pdfPath = $pdfService->generateAbstractPdf($submission);
            $submission->update(['abstract_pdf' => $pdfPath]);
        }

        // Return PDF download response
        $fullPath = storage_path('app/public/abstracts/' . $submission->abstract_pdf);
        
        if (!file_exists($fullPath)) {
            return redirect()->back()->with('error', 'File PDF tidak ditemukan.');
        }

        return response()->download($fullPath, $submission->abstract_pdf);
    }

    /**
     * Regenerate PDF for abstract submission
     */
    public function regeneratePdf(AbstractSubmission $submission)
    {
        // Load the submission with relationships
        $submission->load([
            'user.profile.country',
            'contributors.country',
            'country',
            'reviewer'
        ]);

        // Regenerate PDF
        $pdfService = new PdfGenerationService();
        $pdfPath = $pdfService->regenerateAbstractPdf($submission);

        // Update submission with new PDF path
        $submission->update(['abstract_pdf' => $pdfPath]);

        return redirect()->back()->with('success', 'PDF berhasil di-generate ulang.');
    }

    /**
     * Update the status of an abstract submission
     */
    public function updateStatus(Request $request, AbstractSubmission $submission)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'reviewer_notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($request, $submission) {
            $submission->update([
                'status' => $request->status,
                'reviewer_notes' => $request->reviewer_notes,
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

            // Create email notification if approved
            if ($request->status === 'approved') {
                $this->createApprovalEmailNotification($submission);
            }
        });

        return redirect()->back()->with('success', 'Status submission berhasil diperbarui.');
    }

    /**
     * Bulk approve submissions
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:abstract_submissions,id',
        ]);

        DB::transaction(function () use ($request) {
            $submissions = AbstractSubmission::whereIn('id', $request->submission_ids)
                ->where('status', 'pending')
                ->get();

            foreach ($submissions as $submission) {
                $submission->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);

                $this->createApprovalEmailNotification($submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->submission_ids) . ' submission.'
        );
    }

    /**
     * Bulk reject submissions
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:abstract_submissions,id',
            'reviewer_notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($request) {
            AbstractSubmission::whereIn('id', $request->submission_ids)
                ->where('status', 'pending')
                ->update([
                    'status' => 'rejected',
                    'reviewer_notes' => $request->reviewer_notes,
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menolak ' . count($request->submission_ids) . ' submission.'
        );
    }

    /**
     * Display payment management page
     */
    public function payments(Request $request): Response
    {
        $query = SubmissionPayment::with([
            'submission.user.profile',
            'submission.contributors',
            'reviewer'
        ]);

        // Filter by payment status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('submission', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $payments = $query->orderBy('uploaded_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Calculate stats
        $stats = [
            'total' => SubmissionPayment::count(),
            'pending' => SubmissionPayment::where('status', 'pending')->count(),
            'approved' => SubmissionPayment::where('status', 'approved')->count(),
            'rejected' => SubmissionPayment::where('status', 'rejected')->count(),
            'total_amount' => SubmissionPayment::where('status', 'approved')->sum('amount'),
        ];

        return Inertia::render('Admin/AbstractSubmissions/Payments', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, AbstractSubmission $submission)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if (!$submission->payment) {
            return redirect()->back()->with('error', 'Payment tidak ditemukan.');
        }

        DB::transaction(function () use ($request, $submission) {
            $submission->payment->update([
                'status' => $request->status,
                'admin_notes' => $request->admin_notes,
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

            // Create LOA email notification if approved
            if ($request->status === 'approved') {
                $this->createLoaEmailNotification($submission);
            }
        });

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    /**
     * Bulk approve payments
     */
    public function bulkApprovePayments(Request $request)
    {
        $request->validate([
            'payment_ids' => 'required|array',
            'payment_ids.*' => 'exists:submission_payments,id',
        ]);

        DB::transaction(function () use ($request) {
            $payments = SubmissionPayment::with('submission')
                ->whereIn('id', $request->payment_ids)
                ->where('status', 'pending')
                ->get();

            foreach ($payments as $payment) {
                $payment->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);

                $this->createLoaEmailNotification($payment->submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->payment_ids) . ' pembayaran.'
        );
    }

    /**
     * Create approval email notification
     */
    private function createApprovalEmailNotification(AbstractSubmission $submission): void
    {
        // Get ICMA LPPM user ID
        $icmaLppmUserId = User::where('email', 'icmasure.lppm@unsoed.ac.id')->first()?->id;
        
        $notification = EmailNotification::create([
            'submission_id' => $submission->id,
            'type' => 'abstract_approved',
            'recipient_email' => $submission->user->email,
            'subject' => 'Abstract Submission Approved - Payment Required',
            'body' => $this->generateApprovalEmailBody($submission),
            'status' => 'pending',
            'sent_by' => $icmaLppmUserId ?? Auth::id(),
        ]);

        // Dispatch email job immediately
        SendEmailNotificationJob::dispatch($notification);
    }

    /**
     * Create LOA email notification
     */
    private function createLoaEmailNotification(AbstractSubmission $submission): void
    {
        // Get ICMA LPPM user ID
        $icmaLppmUserId = User::where('email', 'icmasure.lppm@unsoed.ac.id')->first()?->id;
        
        $notification = EmailNotification::create([
            'submission_id' => $submission->id,
            'type' => 'loa_ready',
            'recipient_email' => $submission->user->email,
            'subject' => 'Letter of Acceptance (LOA) - ICMA-SURE 2025',
            'body' => $this->generateLoaEmailBody($submission),
            'status' => 'pending',
            'sent_by' => $icmaLppmUserId ?? Auth::id(),
        ]);

        // Dispatch email job immediately
        SendEmailNotificationJob::dispatch($notification);
    }

    /**
     * Generate approval email body
     */
    private function generateApprovalEmailBody(AbstractSubmission $submission): string
    {
        $participantName = $submission->user->profile->full_name ?? $submission->user->name;
        $contributorCount = $submission->contributors ? count($submission->contributors) : 0;
        $totalParticipants = 1 + $contributorCount; // Main author + contributors
        $feePerParticipant = 150000; // IDR 150,000
        $totalAmount = $totalParticipants * $feePerParticipant;
        $formattedAmount = 'IDR ' . number_format($totalAmount, 0, ',', '.');
        
        $uploadUrl = url('/user/submissions/' . $submission->id . '/upload-payment');
        
        return "Dear {$participantName},\n\n" .
               "Thank you for submitting your abstract to 8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025. We are pleased to confirm that your submission has been successfully received.\n\n" .
               "In accordance with the registration process, we kindly request the payment of the registration fee of IDR 150,000 per participant.\n\n" .
               "Abstract Title: {$submission->title}\n" .
               "Number of Participants: {$totalParticipants} (1 main author + {$contributorCount} contributors)\n" .
               "Therefore, the total amount due is: {$formattedAmount}\n\n" .
               "Please make the payment to the following account:\n" .
               "• Bank Name: Bank Mandiri\n" .
               "• Account Number: 1800044322222\n" .
               "• Account Holder: RPL 029 BLU Unsoed\n\n" .
               "After making the payment, please upload your payment proof (JPEG, JPG, PNG format) at:\n" .
               "{$uploadUrl}\n\n" .
               "Upon confirmation of your payment, we will issue the Letter of Acceptance (LoA) as proof of your participation in 8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025.\n\n" .
               "We greatly appreciate your prompt attention to this matter and look forward to your active participation in the conference.\n\n" .
               "Best regards,\n" .
               "ICMA-SURE 2025 Organizing Committee\n" .
               "Faculty of Agriculture, Universitas Jenderal Soedirman\n" .
               "Email: icmasure.lppm@unsoed.ac.id";
    }

    /**
     * Generate LOA email body
     */
    private function generateLoaEmailBody(AbstractSubmission $submission): string
    {
        $participantName = $submission->user->profile->full_name ?? $submission->user->name;
        
        return "Dear {$participantName},\n\n" .
               "LETTER OF ACCEPTANCE (LOA)\n" .
               "8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025\n\n" .
               "Thank you for submitting your abstract for presentation at the 8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025.\n\n" .
               "After a thorough review, we are pleased to inform you that your abstract, entitled:\n\n" .
               "\"{$submission->title}\"\n\n" .
               "has met the preliminary acceptance requirements set forth by our Scientific Committee and has been accepted for oral presentation at the conference.\n\n" .
               "CONFERENCE DETAILS:\n" .
               "• Conference Name: 8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025\n" .
               "• Date: October 7, 2025\n" .
               "• Format: Virtual Conference via Zoom\n" .
               "• Presentation Type: Oral Presentation\n\n" .
               "This Letter of Acceptance serves as official confirmation of your participation in the conference. Please keep this document for your records.\n\n" .
               "Should you require any further information, please do not hesitate to contact us at icmasure.lppm@unsoed.ac.id or visit our website.\n\n" .
               "We look forward to your active participation and valuable contribution to the conference.\n\n" .
               "Best regards,\n\n" .
               "ICMA-SURE 2025 Organizing Committee\n" .
               "Faculty of Agriculture, Universitas Jenderal Soedirman\n" .
               "Email: icmasure.lppm@unsoed.ac.id\n" .
               "Website: https://icma8.lppm.unsoed.ac.id/";
    }

    /**
     * Approve abstract only (first stage approval)
     */
    public function approveAbstract(Request $request)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:abstract_submissions,id',
        ]);

        DB::transaction(function () use ($request) {
            $submissions = AbstractSubmission::whereIn('id', $request->submission_ids)
                ->where('status', 'pending')
                ->get();

            foreach ($submissions as $submission) {
                // Update submission status to approved
                $submission->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);

                // Create payment record with pending status
                $contributorCount = $submission->contributors ? count($submission->contributors) : 0;
                $totalParticipants = 1 + $contributorCount; // Main author + contributors
                $feePerParticipant = 150000; // IDR 150,000
                $totalAmount = $totalParticipants * $feePerParticipant;

                $submission->payment()->create([
                    'amount' => $totalAmount,
                    'status' => 'pending',
                    'uploaded_at' => now(),
                ]);

                // Send payment invoice email
                $this->createApprovalEmailNotification($submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->submission_ids) . ' abstract. Email invoice telah dikirim ke peserta.'
        );
    }

    /**
     * Approve payment only (second stage approval)
     */
    public function approvePayment(Request $request)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:abstract_submissions,id',
        ]);

        DB::transaction(function () use ($request) {
            $submissions = AbstractSubmission::with('payment')
                ->whereIn('id', $request->submission_ids)
                ->where('status', 'approved')
                ->whereHas('payment', function ($query) {
                    $query->where('status', 'pending');
                })
                ->get();

            foreach ($submissions as $submission) {
                // Update payment status to approved
                $submission->payment->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);

                // Send Letter of Acceptance (LOA)
                $this->createLoaEmailNotification($submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->submission_ids) . ' pembayaran. Email LoA telah dikirim ke peserta.'
        );
    }
}
