<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\OrganizingCommitteeController;
use App\Http\Controllers\Admin\ScientificCommitteeController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\CommitteeController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Middleware\CheckAllowedEmail;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about-the-8th', function () {
    return Inertia::render('AboutUs', [
        'darkMode' => session('darkMode', false)
    ]);
})->name('about.us');

Route::get('/download/{file}', [DownloadController::class, 'downloadFile'])->name('download.file');

Route::get('/committee', [CommitteeController::class, 'index'])->name('committee.index');

Route::get('/reviewer', [ReviewerController::class, 'index'])->name('reviewer.index');

// Rute untuk guest (non-authenticated users)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::get('login/google', [GoogleController::class, 'redirect'])->name('login.google');
    Route::get('login/google/callback', [GoogleController::class, 'callback'])->name('login.google.callback');
});

Route::get('/access-denied', function () {
    return Inertia::render('Auth/AccessDenied');
})->name('access.denied');


Route::middleware(['auth', 'verified', CheckAllowedEmail::class])->group(function () {
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
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout')->middleware('auth');

require __DIR__ . '/settings.php';
