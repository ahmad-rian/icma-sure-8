<?php

namespace App\Http\Controllers;

use App\Models\OrganizingCommittee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommitteeController extends Controller
{
    /**
     * Display the organizing committee page.
     */
    public function index()
    {
        $committees = OrganizingCommittee::get();

        return Inertia::render('Committee', [
            'committees' => $committees,
            'darkMode' => false
        ]);
    }
}
