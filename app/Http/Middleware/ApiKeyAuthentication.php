<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ApiKeyAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get API key from header or query parameter
        $apiKey = $request->header('X-API-Key') ?? $request->query('api_key');
        
        if (!$apiKey) {
            Log::warning('API request without API key', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'API key is required',
                'error_code' => 'MISSING_API_KEY'
            ], 401);
        }
        
        // Get valid API keys from config
        $validApiKeys = config('services.email_api.api_keys', []);
        
        if (empty($validApiKeys)) {
            Log::error('No API keys configured for email API');
            
            return response()->json([
                'success' => false,
                'message' => 'API service not properly configured',
                'error_code' => 'SERVICE_MISCONFIGURED'
            ], 500);
        }
        
        // Check if provided API key is valid
        $isValidKey = false;
        foreach ($validApiKeys as $validKey) {
            if (hash_equals($validKey, $apiKey)) {
                $isValidKey = true;
                break;
            }
        }
        
        if (!$isValidKey) {
            Log::warning('Invalid API key used', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'provided_key' => substr($apiKey, 0, 8) . '...'
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid API key',
                'error_code' => 'INVALID_API_KEY'
            ], 401);
        }
        
        // Log successful authentication
        Log::info('API key authentication successful', [
            'ip' => $request->ip(),
            'url' => $request->fullUrl()
        ]);
        
        return $next($request);
    }
}
