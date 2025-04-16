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
        $positionOrder = [
            'Director' => 1,
            'Vice Rector for Academic' => 2,
            'Head of LPPM Unsoed' => 3,
            'Chairman' => 4,
            'Vice Chairman' => 5,
            'Secretary' => 6,
            'Treasurer' => 7,
            'Reviewer Coordinator' => 8,
            'Event Coordinator ' => 9,
            'Oral Presentation Session Team' => 10,
            'Website Team Coordinator' => 11,
            'Publication Team' => 12,
            'Public Relationship Team' => 13,
            'Catereting Team' => 14,
        ];

        $committeesData = OrganizingCommittee::all();

        $committees = $committeesData->sortBy(function ($committee) use ($positionOrder) {
            return $positionOrder[$committee->position] ?? 999;
        })->values()->all();

        return Inertia::render('Committee', [
            'committees' => $committees,
            'darkMode' => false
        ]);
    }
}
