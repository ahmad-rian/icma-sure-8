<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\OrganizingCommitteeController;
use App\Http\Controllers\Admin\ScientificCommitteeController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\UserProfileController;
use App\Http\Controllers\Admin\AbstractSubmissionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\CommitteeController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Middleware\CheckAllowedEmail;
use App\Http\Middleware\CheckAdminRole;
use App\Http\Middleware\RedirectBasedOnRole;


Route::middleware([RedirectBasedOnRole::class])->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');
});

// Access denied route
Route::get('/access-denied', function () {
    return Inertia::render('Errors/AccessDenied', [
        'message' => 'Akses Anda belum disetujui. Silakan hubungi administrator.'
    ]);
})->name('access.denied');

// User routes (authenticated users)
Route::middleware(['auth', 'verified'])->prefix('user')->name('user.')->group(function () {
    // User dashboard
    Route::get('/dashboard', [\App\Http\Controllers\User\DashboardController::class, 'index'])->name('dashboard');
    
    // User submission routes
    Route::prefix('submissions')->name('submissions.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\SubmissionController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\User\SubmissionController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\User\SubmissionController::class, 'store'])->name('store');
        Route::get('/{submission}', [\App\Http\Controllers\User\SubmissionController::class, 'show'])->name('show');

        Route::get('/{submission}/upload-payment', [\App\Http\Controllers\User\SubmissionController::class, 'showUploadPayment'])->name('upload-payment');
        Route::post('/{submission}/upload-payment', [\App\Http\Controllers\User\SubmissionController::class, 'uploadPayment'])->name('upload-payment.store');
        Route::get('/{submission}/view-payment-proof', [\App\Http\Controllers\User\SubmissionController::class, 'viewPaymentProof'])->name('view-payment-proof');
        Route::get('/{submission}/download-pdf', [\App\Http\Controllers\User\SubmissionController::class, 'downloadPdf'])->name('download-pdf');
        Route::get('/{submission}/download-loa', [\App\Http\Controllers\User\SubmissionController::class, 'downloadLoa'])->name('download-loa');
    });
    
    // User profile routes
    Route::get('/profile', [\App\Http\Controllers\User\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\User\ProfileController::class, 'update'])->name('profile.update');
});

Route::get('/about-the-8th', function () {
    return Inertia::render('AboutUs', [
        'darkMode' => session('darkMode', false)
    ]);
})->name('about.us');

Route::get('/download/{file}', [DownloadController::class, 'downloadFile'])->name('download.file');

Route::get('/committee', [CommitteeController::class, 'index'])->name('committee.index');

Route::get('/reviewer', [ReviewerController::class, 'index'])->name('reviewer.index');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::get('login/google', [GoogleController::class, 'redirect'])->name('login.google');
    Route::get('login/google/callback', [GoogleController::class, 'callback'])->name('login.google.callback');
});

// Admin-only routes
Route::middleware(['auth', 'verified', CheckAdminRole::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('organizing-committees', OrganizingCommitteeController::class)->names([
        'index' => 'organizing-committees.index',
        'create' => 'organizing-committees.create',
        'store' => 'organizing-committees.store',
        'show' => 'organizing-committees.show',
        'edit' => 'organizing-committees.edit',
        'update' => 'organizing-committees.update',
        'destroy' => 'organizing-committees.destroy',
    ]);

    Route::resource('scientific-committees', ScientificCommitteeController::class);
    Route::resource('articles', ArticleController::class);
    Route::post('articles/bulk-delete', [ArticleController::class, 'bulkDelete'])->name('articles.bulk-delete');
    Route::resource('events', EventController::class);
    Route::post('events/bulk-delete', [EventController::class, 'bulkDelete'])->name('events.bulk-delete');
    Route::resource('countries', CountryController::class);
    Route::post('countries/bulk-delete', [CountryController::class, 'bulkDelete'])->name('countries.bulk-delete');
    Route::resource('user-profiles', UserProfileController::class);
    Route::post('user-profiles/bulk-delete', [UserProfileController::class, 'bulkDelete'])->name('user-profiles.bulk-delete');

    // User Management Routes (Admin only)
    Route::resource('users', UserController::class);
    Route::post('users/{user}/toggle-access', [UserController::class, 'toggleAccess'])->name('users.toggle-access');
    Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');

    // Abstract Submission Management Routes (Admin only)
    Route::prefix('abstract-submissions')->name('abstract-submissions.')->group(function () {
        Route::get('/', [AbstractSubmissionController::class, 'index'])->name('index');
        Route::get('/create', [AbstractSubmissionController::class, 'create'])->name('create');
        Route::post('/', [AbstractSubmissionController::class, 'store'])->name('store');
        Route::get('/{submission}', [AbstractSubmissionController::class, 'show'])->name('show');
        Route::get('/{submission}/edit', [AbstractSubmissionController::class, 'edit'])->name('edit');
        Route::put('/{submission}', [AbstractSubmissionController::class, 'update'])->name('update');
        Route::delete('/{submission}', [AbstractSubmissionController::class, 'destroy'])->name('destroy');
        Route::patch('/{submission}/status', [AbstractSubmissionController::class, 'updateStatus'])->name('update-status');
        Route::post('/bulk-approve', [AbstractSubmissionController::class, 'bulkApprove'])->name('bulk-approve');
        Route::post('/bulk-reject', [AbstractSubmissionController::class, 'bulkReject'])->name('bulk-reject');
        Route::post('/approve-abstract', [AbstractSubmissionController::class, 'approveAbstract'])->name('approve-abstract');
        Route::post('/approve-payment', [AbstractSubmissionController::class, 'approvePayment'])->name('approve-payment');
        Route::post('/export-excel', [AbstractSubmissionController::class, 'exportExcel'])->name('export-excel');
        
        // PDF management routes
        Route::get('/{submission}/download-pdf', [AbstractSubmissionController::class, 'downloadPdf'])->name('download-pdf');
        Route::post('/{submission}/regenerate-pdf', [AbstractSubmissionController::class, 'regeneratePdf'])->name('regenerate-pdf');
        
        // Payment management routes
        Route::get('/payments', [AbstractSubmissionController::class, 'payments'])->name('payments');
        Route::patch('/payments/{submission}', [AbstractSubmissionController::class, 'updatePaymentStatus'])->name('update-payment-status');
        Route::post('/payments/bulk-approve', [AbstractSubmissionController::class, 'bulkApprovePayments'])->name('bulk-approve-payments');
    });
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout')->middleware('auth');

require __DIR__ . '/settings.php';


Route::fallback(function () {
    return Inertia::render('Errors/404');
});
