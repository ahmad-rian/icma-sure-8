<?php

namespace App\Http\Controllers;

use App\Models\ScientificCommittee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    public function index()
    {
        // Tentukan urutan hierarki posisi (dari tertinggi ke terendah)
        $positionOrder = [
            'Head of Scientific Committee' => 1,
            'Scientific Chair' => 2,
            'International Reviewer' => 3,
            'Senior Reviewer' => 4,
            'Reviewer' => 5,
            'Associate Reviewer' => 6
            // Tambahkan posisi lain sesuai kebutuhan dengan nilai prioritas yang tepat
        ];

        // Ambil semua data scientific committee
        $committeesData = ScientificCommittee::all();

        // Urutkan data berdasarkan hierarki posisi
        $committees = $committeesData->sortBy(function ($committee) use ($positionOrder) {
            // Jika posisi ada dalam array urutan, gunakan nilai prioritasnya
            // Jika tidak, berikan nilai tinggi (999) agar berada di akhir
            return $positionOrder[$committee->position] ?? 999;
        })->values()->all();

        return Inertia::render('Reviewer', [
            'committees' => $committees,
            'darkMode' => false
        ]);
    }
}
