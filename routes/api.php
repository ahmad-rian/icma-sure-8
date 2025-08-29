<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmailApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Email API Routes
|--------------------------------------------------------------------------
|
| These routes handle email sending functionality via API.
| All routes are protected with API key authentication.
|
*/

Route::prefix('email')->middleware(['api.key', 'api.logging'])->group(function () {
    // Send email endpoint
    Route::post('/send', [EmailApiController::class, 'sendEmail'])
        ->name('api.email.send');
    
    // Get email service status
    Route::get('/status', [EmailApiController::class, 'getStatus'])
        ->name('api.email.status');
    
    // Test email connection endpoint
    Route::get('/test-connection', [EmailApiController::class, 'testConnection'])
        ->name('email.test-connection');
    
    // Health check endpoint
    Route::get('/health', [EmailApiController::class, 'healthCheck'])
        ->name('email.health');
    
    // Statistics endpoint
    Route::get('/statistics', [EmailApiController::class, 'getStatistics'])
        ->name('email.statistics');
});

/*
|--------------------------------------------------------------------------
| Public Email API Routes (No Authentication Required)
|--------------------------------------------------------------------------
|
| These routes can be accessed without API key for basic information.
|
*/

Route::prefix('email/public')->group(function () {
    // Get API documentation
    Route::get('/docs', function () {
        return response()->json([
            'service' => 'Email API Service',
            'version' => '1.0.0',
            'description' => 'API service for sending emails from sinarilmu.id application',
            'endpoints' => [
                'POST /api/email/send' => 'Send email (requires API key)',
                'GET /api/email/status' => 'Get service status (requires API key)',
                'GET /api/email/test-connection' => 'Test email connection (requires API key)',
                'GET /api/email/public/docs' => 'Get API documentation (public)'
            ],
            'authentication' => [
                'type' => 'API Key',
                'header' => 'X-API-Key',
                'query_param' => 'api_key (alternative)'
            ],
            'documentation_url' => url('/api/email/public/docs'),
            'support_email' => config('mail.from.address')
        ]);
    })->name('api.email.docs');
});