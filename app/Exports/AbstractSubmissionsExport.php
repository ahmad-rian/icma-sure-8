<?php

namespace App\Exports;

use App\Models\AbstractSubmission;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class AbstractSubmissionsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $submissionIds;
    protected $maxCoAuthors;

    public function __construct(array $submissionIds)
    {
        $this->submissionIds = $submissionIds;
        $this->calculateMaxCoAuthors();
    }

    /**
     * Calculate the maximum number of co-authors across all submissions
     */
    private function calculateMaxCoAuthors()
    {
        $submissions = AbstractSubmission::with(['contributors', 'user'])
            ->whereIn('id', $this->submissionIds)
            ->get();

        $this->maxCoAuthors = 0;
        
        foreach ($submissions as $submission) {
            $contributors = $submission->contributors ?? collect();
            // Exclude primary contact from co-authors count
            $coAuthorsCount = $contributors->where('is_primary_contact', false)->count();
            
            if ($coAuthorsCount > $this->maxCoAuthors) {
                $this->maxCoAuthors = $coAuthorsCount;
            }
        }
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return AbstractSubmission::with(['contributors', 'user', 'user.profile'])
            ->whereIn('id', $this->submissionIds)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Generate dynamic headings based on maximum co-authors
     */
    public function headings(): array
    {
        $headings = [
            'No',
            'Judul Abstract',
            'Main Author (Name)',
            'Main Author (Email)',
            'Main Author (Institution)',
            'Main Author (Country)'
        ];

        // Add dynamic co-author columns
        for ($i = 1; $i <= $this->maxCoAuthors; $i++) {
            $headings[] = "Co-Author {$i} (Name)";
            $headings[] = "Co-Author {$i} (Email)";
            $headings[] = "Co-Author {$i} (Institution)";
            $headings[] = "Co-Author {$i} (Country)";
        }

        $headings[] = 'Status';
        $headings[] = 'Tanggal Submit';
        $headings[] = 'Abstract Type';
        $headings[] = 'Keywords';

        return $headings;
    }

    /**
     * Map each submission to array format
     */
    public function map($submission): array
    {
        static $counter = 0;
        $counter++;

        // Get main author (primary contact or first contributor or user)
        $mainAuthor = $this->getMainAuthor($submission);
        
        // Get co-authors (exclude primary contact)
        $coAuthors = $this->getCoAuthors($submission);

        $row = [
            $counter,
            $submission->title ?? 'N/A',
            $mainAuthor['name'] ?? 'N/A',
            $mainAuthor['email'] ?? 'N/A',
            $mainAuthor['institution'] ?? 'N/A',
            $mainAuthor['country'] ?? 'N/A'
        ];

        // Add co-authors data (fill empty columns if less co-authors than max)
        for ($i = 0; $i < $this->maxCoAuthors; $i++) {
            if (isset($coAuthors[$i])) {
                $row[] = $coAuthors[$i]['name'] ?? 'N/A';
                $row[] = $coAuthors[$i]['email'] ?? 'N/A';
                $row[] = $coAuthors[$i]['institution'] ?? 'N/A';
                $row[] = $coAuthors[$i]['country'] ?? 'N/A';
            } else {
                // Fill empty columns for missing co-authors
                $row[] = '';
                $row[] = '';
                $row[] = '';
                $row[] = '';
            }
        }

        // Add additional submission info
        $row[] = $this->getStatusLabel($submission->status);
        $row[] = $submission->created_at ? $submission->created_at->format('d/m/Y H:i') : 'N/A';
        $row[] = $submission->abstract_type ?? 'N/A';
        $row[] = $submission->keywords ?? 'N/A';

        return $row;
    }

    /**
     * Get main author information
     */
    private function getMainAuthor($submission)
    {
        // Try to get primary contact from contributors
        if ($submission->contributors) {
            $primaryContact = $submission->contributors->where('is_primary_contact', true)->first();
            if ($primaryContact) {
                return [
                    'name' => $primaryContact->name,
                    'email' => $primaryContact->email,
                    'institution' => $primaryContact->institution,
                    'country' => $primaryContact->country->name ?? 'N/A'
                ];
            }
        }

        // Fallback to submission user
        if ($submission->user) {
            return [
                'name' => $submission->user->name,
                'email' => $submission->user->email,
                'institution' => $submission->user->profile->institution ?? 'N/A',
                'country' => $submission->user->profile->country->name ?? 'N/A'
            ];
        }

        return [
            'name' => 'N/A',
            'email' => 'N/A',
            'institution' => 'N/A',
            'country' => 'N/A'
        ];
    }

    /**
     * Get co-authors information (exclude primary contact)
     */
    private function getCoAuthors($submission)
    {
        if (!$submission->contributors) {
            return [];
        }

        return $submission->contributors
            ->where('is_primary_contact', false)
            ->map(function ($contributor) {
                return [
                    'name' => $contributor->name,
                    'email' => $contributor->email,
                    'institution' => $contributor->institution,
                    'country' => $contributor->country->name ?? 'N/A'
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get status label in Indonesian
     */
    private function getStatusLabel($status)
    {
        $labels = [
            'pending' => 'Menunggu Review',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak'
        ];

        return $labels[$status] ?? $status;
    }

    /**
     * Apply styles to the worksheet
     */
    public function styles(Worksheet $sheet)
    {
        // Get the last column letter
        $lastColumn = $sheet->getHighestColumn();
        $lastRow = $sheet->getHighestRow();

        // Header styling
        $sheet->getStyle('A1:' . $lastColumn . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4F46E5']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ]);

        // Data rows styling
        if ($lastRow > 1) {
            $sheet->getStyle('A2:' . $lastColumn . $lastRow)->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC']
                    ]
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_TOP,
                    'wrapText' => true
                ]
            ]);
        }

        // Set row height for header
        $sheet->getRowDimension(1)->setRowHeight(25);
        
        // Set minimum row height for data rows
        for ($i = 2; $i <= $lastRow; $i++) {
            $sheet->getRowDimension($i)->setRowHeight(20);
        }

        return $sheet;
    }
}