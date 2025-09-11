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

    public function __construct(array $submissionIds = null)
    {
        $this->submissionIds = $submissionIds;
    }

    public function setSubmissionIds(array $submissionIds = null)
    {
        $this->submissionIds = $submissionIds;
        return $this;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Load dengan relationship contributors yang sudah diurutkan
        return AbstractSubmission::with(['user', 'contributors' => function ($query) {
            $query->orderBy('order_index');
        }])
            ->when($this->submissionIds, function ($query) {
                return $query->whereIn('id', $this->submissionIds);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Generate headings untuk export yang disederhanakan
     */
    public function headings(): array
    {
        return [
            'No',
            'Judul Abstract',
            'Nama Author',
            'No HP',
            'Email',
            'Contributors'
        ];
    }

    /**
     * Map setiap abstract submission ke format export yang disederhanakan
     */
    public function map($submission): array
    {
        static $no = 1;

        // Safe data extraction
        $authorName = 'N/A';
        $authorPhone = '';
        $authorEmail = '';

        // Try author fields first
        if (!empty($submission->author_first_name) && !empty($submission->author_last_name)) {
            $authorName = trim($submission->author_first_name . ' ' . $submission->author_last_name);
        } elseif (!empty($submission->user->name)) {
            $authorName = $submission->user->name;
        }

        // Get phone
        if (!empty($submission->author_phone_number)) {
            $authorPhone = $submission->author_phone_number;
        }

        // Get email
        if (!empty($submission->author_email)) {
            $authorEmail = $submission->author_email;
        } elseif (!empty($submission->user->email)) {
            $authorEmail = $submission->user->email;
        }

        // Get contributors - menggunakan accessor full_name yang sudah ada di model
        $contributorNames = [];
        if ($submission->contributors && $submission->contributors->count() > 0) {
            foreach ($submission->contributors as $contributor) {
                // Gunakan accessor full_name dari model SubmissionContributor
                $fullName = $contributor->full_name ?? '';
                if (!empty($fullName)) {
                    $contributorNames[] = $fullName;
                }
            }
        }
        $contributorsText = implode(', ', $contributorNames);

        $data = [
            $no++,
            $submission->title ?? 'N/A',
            $authorName,
            $authorPhone,
            $authorEmail,
            $contributorsText
        ];

        return $data;
    }

    /**
     * Apply styles ke worksheet
     */
    public function styles(Worksheet $sheet)
    {
        // Style header row
        $sheet->getStyle('A1:F1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        // Style data rows
        $highestRow = $sheet->getHighestRow();
        if ($highestRow > 1) {
            $sheet->getStyle("A2:F{$highestRow}")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_TOP,
                    'wrapText' => true,
                ],
            ]);
        }

        // Auto-adjust row heights
        for ($row = 1; $row <= $highestRow; $row++) {
            $sheet->getRowDimension($row)->setRowHeight(-1);
        }

        return $sheet;
    }
}
