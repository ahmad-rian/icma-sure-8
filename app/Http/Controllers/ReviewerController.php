<?php

namespace App\Http\Controllers;

use App\Models\ScientificCommittee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    public function index()
    {
        $committees = ScientificCommittee::get();

        return Inertia::render('Reviewer', [
            'committees' => $committees,
            'darkMode' => false
        ]);
    }
}
