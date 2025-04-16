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
        // Tentukan urutan hierarki posisi (dari tertinggi ke terendah)
        $positionOrder = [
            'Director' => 1,
            'Chairman' => 2,
            'Vice Chairman' => 3,
            'Secretary' => 4,
            'Treasurer' => 5,
            'Vice Rector for Academic' => 6,
            'Head of LPPM Unsoed' => 7,
            'Reviewer Coordinator' => 8,
            'Publication Team' => 9,
            'Oral Presentation Session Team' => 10,
            'Website Team Coordinator' => 11
            // Tambahkan posisi lain sesuai kebutuhan dengan nilai prioritas yang tepat
        ];

        // Ambil semua data komite
        $committeesData = OrganizingCommittee::all();

        // Urutkan data berdasarkan hierarki posisi
        $committees = $committeesData->sortBy(function ($committee) use ($positionOrder) {
            // Jika posisi ada dalam array urutan, gunakan nilai prioritasnya
            // Jika tidak, berikan nilai tinggi (999) agar berada di akhir
            return $positionOrder[$committee->position] ?? 999;
        })->values()->all();

        return Inertia::render('Committee', [
            'committees' => $committees,
            'darkMode' => false
        ]);
    }
}
