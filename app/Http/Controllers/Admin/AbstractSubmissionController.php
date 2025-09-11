<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbstractSubmission;
use App\Models\SubmissionPayment;
use App\Models\User;
use App\Models\Country;
use App\Services\PdfGenerationService;
use App\Services\EmailApiService;
use App\Exports\AbstractSubmissionsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Inertia\Response;

class AbstractSubmissionController extends Controller
{
    /**
     * Get latest submission updates for polling
     */
    public function getUpdates(Request $request)
    {
        $lastCheck = $request->get('last_check');
        $currentTime = now();

        // Get submissions with recent payment proof uploads
        $query = AbstractSubmission::with([
            'user.profile.country',
            'contributors.country',
            'country',
            'payment.reviewer',
            'reviewer'
        ]);

        // If last_check is provided, only get updates since then
        if ($lastCheck) {
            $query->where(function ($q) use ($lastCheck) {
                $q->where('updated_at', '>', $lastCheck)
                    ->orWhereHas('payment', function ($paymentQuery) use ($lastCheck) {
                        $paymentQuery->where('updated_at', '>', $lastCheck)
                            ->whereNotNull('payment_proof');
                    });
            });
        }

        $submissions = $query->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        // Get recent payment proof uploads specifically
        $recentPayments = SubmissionPayment::with('submission.user')
            ->whereNotNull('payment_proof')
            ->when($lastCheck, function ($q) use ($lastCheck) {
                return $q->where('updated_at', '>', $lastCheck);
            })
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'submissions' => $submissions,
            'recent_payments' => $recentPayments,
            'timestamp' => $currentTime->toISOString(),
            'has_updates' => $submissions->count() > 0 || $recentPayments->count() > 0
        ]);
    }

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

        // Filter by status - handle detailed status filtering
        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status;

            switch ($status) {
                case 'pending':
                    $query->where('status', 'pending');
                    break;
                case 'pending-abstract':
                    $query->where('status', 'pending');
                    break;
                case 'pending-payment':
                    $query->where('status', 'approved')
                        ->whereHas('payment', function ($q) {
                            $q->where('status', 'pending');
                        });
                    break;
                case 'approved':
                    $query->where('status', 'approved');
                    break;
                case 'approved-abstract':
                    $query->where('status', 'approved');
                    break;
                case 'approved-payment':
                    $query->where('status', 'approved')
                        ->whereHas('payment', function ($q) {
                            $q->where('status', 'approved');
                        });
                    break;
                case 'rejected':
                    $query->where('status', 'rejected');
                    break;
                case 'rejected-abstract':
                    $query->where('status', 'rejected');
                    break;
                case 'rejected-payment':
                    $query->where('status', 'approved')
                        ->whereHas('payment', function ($q) {
                            $q->where('status', 'rejected');
                        });
                    break;
            }
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

        // Get detailed statistics
        $stats = [
            'total' => AbstractSubmission::count(),
            'pending' => AbstractSubmission::where('status', 'pending')->count(),
            'pending_abstract' => AbstractSubmission::where('status', 'pending')->count(),
            'pending_payment' => AbstractSubmission::where('status', 'approved')
                ->whereHas('payment', function ($q) {
                    $q->where('status', 'pending');
                })->count(),
            'approved' => AbstractSubmission::where('status', 'approved')->count(),
            'approved_abstract' => AbstractSubmission::where('status', 'approved')->count(),
            'approved_payment' => AbstractSubmission::where('status', 'approved')
                ->whereHas('payment', function ($q) {
                    $q->where('status', 'approved');
                })->count(),
            'rejected' => AbstractSubmission::where('status', 'rejected')->count(),
            'rejected_abstract' => AbstractSubmission::where('status', 'rejected')->count(),
            'rejected_payment' => AbstractSubmission::where('status', 'approved')
                ->whereHas('payment', function ($q) {
                    $q->where('status', 'rejected');
                })->count(),
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
            'author_first_name' => 'nullable|string|max:255',
            'author_last_name' => 'nullable|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'author_affiliation' => 'nullable|string|max:255',
            'author_phone_number' => 'nullable|string|max:20',
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
            // Create submission with form data
            $submission = AbstractSubmission::create([
                'user_id' => $request->user_id,
                'country_id' => $request->country_id,
                'author_first_name' => $request->author_first_name,
                'author_last_name' => $request->author_last_name,
                'author_email' => $request->author_email,
                'author_affiliation' => $request->author_affiliation,
                'author_phone_number' => $request->author_phone_number,
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
            'reviewer'
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
            'author_first_name' => 'nullable|string|max:255',
            'author_last_name' => 'nullable|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'author_affiliation' => 'nullable|string|max:255',
            'author_phone_number' => 'nullable|string|max:20',
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
            // Update submission with form data
            $submission->update([
                'user_id' => $request->user_id,
                'country_id' => $request->country_id,
                'author_first_name' => $request->author_first_name,
                'author_last_name' => $request->author_last_name,
                'author_email' => $request->author_email,
                'author_affiliation' => $request->author_affiliation,
                'author_phone_number' => $request->author_phone_number,
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

            // Send email notification if approved
            if ($request->status === 'approved') {
                $this->sendApprovalEmailNotification($submission);
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

                $this->sendApprovalEmailNotification($submission);
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

            // Send LOA email if approved
            if ($request->status === 'approved') {
                $this->sendLoaEmailNotification($submission);
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

                $this->sendLoaEmailNotification($payment->submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->payment_ids) . ' pembayaran.'
        );
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
                $this->sendApprovalEmailNotification($submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->submission_ids) . ' abstract. Email invoice telah dikirim ke peserta.'
        );
    }

    /**
     * Export selected submissions to Excel
     */
    public function exportExcel(Request $request)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:abstract_submissions,id',
        ]);

        $submissionIds = $request->submission_ids;

        // Generate filename with timestamp
        $filename = 'abstract_submissions_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

        try {
            // Create export instance
            $export = new AbstractSubmissionsExport($submissionIds);

            // Test basic functionality first
            Log::info('Starting Excel export', ['submission_count' => count($submissionIds)]);

            return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::XLSX, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]);
        } catch (\Exception $e) {
            Log::error('Export Excel failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Gagal mengexport data ke Excel: ' . $e->getMessage()], 500);
        }
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
                $this->sendLoaEmailNotification($submission);
            }
        });

        return redirect()->back()->with(
            'success',
            'Berhasil menyetujui ' . count($request->submission_ids) . ' pembayaran. Email LoA telah dikirim ke peserta.'
        );
    }

    /**
     * Send approval email notification with proper HTML handling
     */
    private function sendApprovalEmailNotification(AbstractSubmission $submission): void
    {
        try {
            $emailService = new EmailApiService();
            $htmlContent = $this->generateApprovalEmailBody($submission);

            // First try API with HTML content type
            $emailData = [
                'to' => [$submission->user->email],
                'subject' => 'Abstract Submission Approved - Payment Required',
                'body' => $htmlContent,
                'content_type' => 'text/html',
                'from_name' => 'ICMA SURE'
            ];

            $result = $emailService->sendViaApi($emailData);

            if ($result['success']) {
                Log::info('Approval email sent via Sinar Ilmu API', [
                    'submission_id' => $submission->id,
                    'recipient' => $submission->user->email,
                    'message_id' => $result['data']['message_id'] ?? null
                ]);
            } else {
                // Fallback to Laravel Mail with HTML
                $this->sendHtmlMail(
                    $submission->user->email,
                    'Abstract Submission Approved - Payment Required',
                    $htmlContent,
                    'ICMA SURE'
                );

                Log::info('Approval email sent via Laravel Mail fallback', [
                    'submission_id' => $submission->id,
                    'recipient' => $submission->user->email,
                    'api_error' => $result['message'] ?? 'Unknown API error'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send approval email', [
                'submission_id' => $submission->id,
                'recipient' => $submission->user->email,
                'error' => $e->getMessage()
            ]);

            // Emergency fallback
            try {
                $this->sendHtmlMail(
                    $submission->user->email,
                    'Abstract Submission Approved - Payment Required',
                    $this->generateApprovalEmailBody($submission),
                    'ICMA SURE'
                );

                Log::info('Approval email sent via emergency fallback', [
                    'submission_id' => $submission->id
                ]);
            } catch (\Exception $fallbackError) {
                Log::critical('All email methods failed for approval notification', [
                    'submission_id' => $submission->id,
                    'original_error' => $e->getMessage(),
                    'fallback_error' => $fallbackError->getMessage()
                ]);
            }
        }
    }

    /**
     * Send LOA email notification with proper HTML handling
     */
    private function sendLoaEmailNotification(AbstractSubmission $submission): void
    {
        try {
            $emailService = new EmailApiService();
            $htmlContent = $this->generateLoaEmailBody($submission);

            // First try API with HTML content type
            $emailData = [
                'to' => [$submission->user->email],
                'subject' => 'Letter of Acceptance (LOA) - ICMA-SURE 2025',
                'body' => $htmlContent,
                'content_type' => 'text/html',
                'from_name' => 'ICMA SURE'
            ];

            $result = $emailService->sendViaApi($emailData);

            if ($result['success']) {
                Log::info('LOA email sent via Sinar Ilmu API', [
                    'submission_id' => $submission->id,
                    'recipient' => $submission->user->email,
                    'message_id' => $result['data']['message_id'] ?? null
                ]);
            } else {
                // Fallback to Laravel Mail with HTML
                $this->sendHtmlMail(
                    $submission->user->email,
                    'Letter of Acceptance (LOA) - ICMA-SURE 2025',
                    $htmlContent,
                    'ICMA SURE'
                );

                Log::info('LOA email sent via Laravel Mail fallback', [
                    'submission_id' => $submission->id,
                    'recipient' => $submission->user->email,
                    'api_error' => $result['message'] ?? 'Unknown API error'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send LOA email', [
                'submission_id' => $submission->id,
                'recipient' => $submission->user->email,
                'error' => $e->getMessage()
            ]);

            // Emergency fallback
            try {
                $this->sendHtmlMail(
                    $submission->user->email,
                    'Letter of Acceptance (LOA) - ICMA-SURE 2025',
                    $this->generateLoaEmailBody($submission),
                    'ICMA SURE'
                );

                Log::info('LOA email sent via emergency fallback', [
                    'submission_id' => $submission->id
                ]);
            } catch (\Exception $fallbackError) {
                Log::critical('All email methods failed for LOA notification', [
                    'submission_id' => $submission->id,
                    'original_error' => $e->getMessage(),
                    'fallback_error' => $fallbackError->getMessage()
                ]);
            }
        }
    }

    /**
     * Helper method to send HTML emails via Laravel Mail
     */
    private function sendHtmlMail(string $to, string $subject, string $htmlContent, string $fromName): void
    {
        Mail::send([], [], function ($message) use ($to, $subject, $htmlContent, $fromName) {
            $message->to($to)
                ->subject($subject)
                ->from(config('mail.from.address'), $fromName)
                ->html($htmlContent);
        });
    }

    /**
     * Generate approval email body with improved HTML structure
     */
    private function generateApprovalEmailBody(AbstractSubmission $submission): string
    {
        $participantName = $submission->user->profile->full_name ?? $submission->user->name;
        $contributorCount = $submission->contributors ? count($submission->contributors) : 0;
        $totalParticipants = 1 + $contributorCount;
        $feePerParticipant = 150000;
        $totalAmount = $totalParticipants * $feePerParticipant;
        $formattedAmount = 'IDR ' . number_format($totalAmount, 0, ',', '.');
        $uploadUrl = url('/user/submissions/' . $submission->id . '/upload-payment');

        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abstract Submission Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .header h2 { color: #007bff; margin: 0; }
        .header p { margin: 5px 0; color: #666; }
        .success-box { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success-box h3 { margin-top: 0; color: #28a745; }
        .payment-info { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .payment-info h4 { margin-top: 0; color: #856404; }
        .payment-info ul { list-style: none; padding: 0; }
        .payment-info li { margin: 5px 0; }
        .btn { display: inline-block; background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center; }
        .whatsapp-box { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>ICMA-SURE 2025</h2>
            <p>8th International Conference on Multidisciplinary Approaches<br>for Sustainable Rural Development</p>
        </div>
        
        <p>Dear <strong>' . htmlspecialchars($participantName) . '</strong>,</p>
        
        <p>Thank you for submitting your abstract to <strong>ICMA-SURE 2025</strong>. We are pleased to confirm that your submission has been successfully received and reviewed.</p>
        
        <div class="success-box">
            <h3>Your Abstract Has Been Accepted!</h3>
            <p><strong>Abstract Title:</strong> ' . htmlspecialchars($submission->title) . '</p>
        </div>
        
        <p>In accordance with the registration process, we kindly request the payment of the registration fee.</p>
        
        <div class="payment-info">
            <h4>Payment Information</h4>
            <p><strong>Registration Fee:</strong> IDR 150,000 per participant</p>
            <p><strong>Number of Participants:</strong> ' . $totalParticipants . ' (1 main author + ' . $contributorCount . ' contributors)</p>
            <p style="font-weight: bold; color: #856404;">Total Amount Due: ' . $formattedAmount . '</p>
            
            <h4>Bank Details</h4>
            <ul>
                <li><strong>Bank Name:</strong> Bank Mandiri</li>
                <li><strong>Account Number:</strong> 1800044322222</li>
                <li><strong>Account Holder:</strong> RPL 029 BLU Unsoed</li>
            </ul>
        </div>
        
        <p>After making the payment, please upload your payment proof (JPEG, JPG, PNG format) at:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="' . $uploadUrl . '" class="btn">Upload Payment Proof</a>
        </div>
        
        <p>Upon confirmation of your payment, we will issue the <strong>Letter of Acceptance (LoA)</strong> as proof of your participation.</p>
        
        <div class="whatsapp-box">
            <h4>JOIN OUR WHATSAPP GROUP:</h4>
            <p>For important updates and announcements, please join our WhatsApp group:<br>
            <a href="https://chat.whatsapp.com/LQ6C4Z2xDwe4tQq072uJU1?mode=ems_wa_c" style="color: #25d366; font-weight: bold;">https://chat.whatsapp.com/LQ6C4Z2xDwe4tQq072uJU1?mode=ems_wa_c</a></p>
        </div>
        
        <div class="footer">
            <p><strong>ICMA-SURE 2025 Organizing Committee</strong><br>
            Universitas Jenderal Soedirman<br>
            Email: icmasure.lppm@unsoed.ac.id</p>
        </div>
    </div>
</body>
</html>';
    }

    /**
     * Generate LOA email body with improved HTML structure
     */
    private function generateLoaEmailBody(AbstractSubmission $submission): string
    {
        $participantName = $submission->user->profile->full_name ?? $submission->user->name;

        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letter of Acceptance - ICMA-SURE 2025</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .header h2 { color: #007bff; margin: 0; }
        .header p { margin: 5px 0; color: #666; }
        .loa-header { background-color: #e7f3ff; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .loa-header h2 { margin: 0; color: #007bff; font-size: 20px; }
        .congratulations-box { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .congratulations-box h3 { margin-top: 0; }
        .details-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff; }
        .details-box h4 { margin-top: 0; color: #007bff; }
        .conference-info { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .conference-info h4 { margin-top: 0; color: #856404; }
        .conference-info ul { list-style: none; padding: 0; }
        .conference-info li { margin: 5px 0; }
        .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>ICMA-SURE 2025</h2>
            <p>8th International Conference on Multidisciplinary Approaches<br>for Sustainable Rural Development</p>
        </div>
        
        <div class="loa-header">
            <h2>LETTER OF ACCEPTANCE (LOA)</h2>
        </div>
        
        <p>Dear <strong>' . htmlspecialchars($participantName) . '</strong>,</p>
        
        <div class="congratulations-box">
            <h3>Congratulations!</h3>
            <p style="margin-bottom: 0;">Your payment has been confirmed and your abstract has been accepted for presentation.</p>
        </div>
        
        <p>Thank you for submitting your abstract for presentation at the <strong>8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025</strong>.</p>
        
        <p>After a thorough review, we are pleased to inform you that your abstract has met the preliminary acceptance requirements set forth by our Scientific Committee and has been <strong>accepted for oral presentation</strong> at the conference.</p>
        
        <div class="details-box">
            <h4>Your Abstract Details</h4>
            <p><strong>Title:</strong> "' . htmlspecialchars($submission->title) . '"</p>
            <p><strong>Presentation Type:</strong> Oral Presentation</p>
        </div>
        
        <div class="conference-info">
            <h4>Conference Details</h4>
            <ul>
                <li><strong>Conference:</strong> 8th ICMA-SURE 2025</li>
                <li><strong>Date:</strong> October 7, 2025</li>
                <li><strong>Format:</strong> Virtual Conference via Zoom</li>
                <li><strong>Presentation Type:</strong> Oral Presentation</li>
            </ul>
        </div>
        
        <p>This Letter of Acceptance serves as <strong>official confirmation</strong> of your participation in the conference. Please keep this document for your records.</p>
        
        <p>Should you require any further information, please do not hesitate to contact us at <strong>icmasure.lppm@unsoed.ac.id</strong> or visit our website.</p>
        
        <p>We look forward to your active participation and valuable contribution to the conference.</p>
        
        <div class="footer">
            <p><strong>ICMA-SURE 2025 Organizing Committee</strong><br>
            Universitas Jenderal Soedirman<br>
            Email: icmasure.lppm@unsoed.ac.id<br>
            Website: https://icma8.lppm.unsoed.ac.id/</p>
        </div>
    </div>
</body>
</html>';
    }
}
