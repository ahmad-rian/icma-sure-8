<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\OrganizingCommitteeController;
use App\Http\Controllers\Admin\ScientificCommitteeController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\UserController;
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
Route::middleware(['auth', 'verified', CheckAdminRole::class])->group(function () {
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
    Route::resource('events', EventController::class);

    // User Management Routes (Admin only)
    Route::resource('users', UserController::class);
    Route::post('users/{user}/toggle-access', [UserController::class, 'toggleAccess'])->name('users.toggle-access');
    Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout')->middleware('auth');

require __DIR__ . '/settings.php';


Route::fallback(function () {
    return Inertia::render('Errors/404');
});
