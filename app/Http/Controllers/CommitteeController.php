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
        // Ambil data dari database dan urutkan berdasarkan posisi dan nama
        $committees = OrganizingCommittee::orderBy('position')
            ->orderBy('name')
            ->get();

        // Render halaman Committee dengan data yang sudah diambil
        return Inertia::render('Committee', [
            'committees' => $committees,
            'darkMode' => false // Default dark mode setting
        ]);
    }
}
