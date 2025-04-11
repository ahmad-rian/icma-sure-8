<?php

namespace App\Http\Controllers;

use App\Models\ScientificCommittee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    /**
     * Display the scientific committee page.
     */
    public function index()
    {
        // Ambil data dari database dan urutkan berdasarkan posisi dan nama
        $committees = ScientificCommittee::orderBy('position')
            ->orderBy('name')
            ->get();

        // Render halaman Reviewer dengan data yang sudah diambil
        return Inertia::render('Reviewer', [
            'committees' => $committees,
            'darkMode' => false // Default dark mode setting
        ]);
    }
}
