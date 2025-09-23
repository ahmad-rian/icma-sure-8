<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionClosedController extends Controller
{
    /**
     * Display the submission closed page.
     */
    public function index(): Response
    {
        return Inertia::render('User/SubmissionClosed');
    }
}
