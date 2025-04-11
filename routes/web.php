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


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about-the-8th', function () {
    return Inertia::render('AboutUs', [
        'darkMode' => session('darkMode', false)
    ]);
})->name('about.us');

// Route untuk download file
Route::get('/download/{file}', [DownloadController::class, 'downloadFile'])->name('download.file');

Route::get('/committee', [CommitteeController::class, 'index'])->name('committee.index');


Route::get('/reviewer', [ReviewerController::class, 'index'])->name('reviewer.index');

Route::middleware(['auth', 'verified'])->group(function () {
    // Use the DashboardController instead of directly rendering
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Routes for Organizing Committee
    Route::resource('organizing-committees', OrganizingCommitteeController::class)
        ->names([
            'index' => 'organizing-committees.index',
            'create' => 'organizing-committees.create',
            'store' => 'organizing-committees.store',
            'show' => 'organizing-committees.show',
            'edit' => 'organizing-committees.edit',
            'update' => 'organizing-committees.update',
            'destroy' => 'organizing-committees.destroy',
        ]);

    // Scientific Committee routes
    Route::resource('scientific-committees', ScientificCommitteeController::class);

    // Articles routes
    Route::resource('articles', ArticleController::class);

    // Events routes
    Route::resource('events', EventController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
