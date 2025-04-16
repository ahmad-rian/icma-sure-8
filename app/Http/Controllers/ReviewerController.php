<?php

namespace App\Http\Controllers;

use App\Models\ScientificCommittee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    public function index()
    {
        $positionOrder = [
            'Editorial Team' => 1,
            'Reviewer' => 2,
        ];

        $committeesData = ScientificCommittee::all();

        $committees = $committeesData->sortBy(function ($committee) use ($positionOrder) {
            return $positionOrder[$committee->position] ?? 999;
        })->values()->all();

        return Inertia::render('Reviewer', [
            'committees' => $committees,
            'darkMode' => false
        ]);
    }
}
