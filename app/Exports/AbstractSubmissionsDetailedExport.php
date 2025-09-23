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

class AbstractSubmissionsDetailedExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $submissionIds;

    public function __construct(?array $submissionIds = null)
    {
        $this->submissionIds = $submissionIds;
    }

    public function setSubmissionIds(?array $submissionIds = null)
    {
        $this->submissionIds = $submissionIds;
        return $this;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Load dengan relationship contributors dan country
        return AbstractSubmission::with(['user', 'contributors' => function ($query) {
            $query->orderBy('order_index');
        }, 'country'])
            ->when($this->submissionIds, function ($query) {
                return $query->whereIn('id', $this->submissionIds);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Generate headings untuk export yang lengkap
     */
    public function headings(): array
    {
        return [
            'No',
            'ID Submission',
            'Judul Abstract',
            'Nama Author',
            'Email Author',
            'No HP Author',
            'Afiliasi Author',
            'Negara',
            'Keywords',
            'Contributors',
            'Afiliasi Contributors',
            'Abstract Content',
            'Status',
            'Tanggal Submit',
            'Registration Fee',
            'Payment Required',
            'Reviewer Notes'
        ];
    }

    /**
     * Map setiap abstract submission ke format export yang lengkap
     */
    public function map($submission): array
    {
        static $no = 1;

        // Safe data extraction
        $authorName = 'N/A';
        $authorPhone = '';
        $authorEmail = '';
        $authorAffiliation = '';

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

        // Get author affiliation
        if (!empty($submission->author_affiliation)) {
            $authorAffiliation = $submission->author_affiliation;
        }

        // Get country
        $countryName = $submission->country->name ?? 'N/A';

        // Get keywords - convert array to comma-separated string
        $keywords = '';
        if (!empty($submission->keywords) && is_array($submission->keywords)) {
            $keywords = implode(', ', $submission->keywords);
        }

        // Get contributors - menggunakan accessor full_name yang sudah ada di model
        $contributorNames = [];
        $contributorAffiliations = [];
        if ($submission->contributors && $submission->contributors->count() > 0) {
            foreach ($submission->contributors as $contributor) {
                // Gunakan accessor full_name dari model SubmissionContributor
                $fullName = $contributor->full_name ?? '';
                if (!empty($fullName)) {
                    $contributorNames[] = $fullName;
                }

                // Get contributor affiliation
                $affiliation = $contributor->affiliation ?? '';
                if (!empty($affiliation)) {
                    $contributorAffiliations[] = $affiliation;
                }
            }
        }
        $contributorsText = implode(', ', $contributorNames);
        $contributorAffiliationsText = implode('; ', $contributorAffiliations);

        // Get abstract content - clean HTML tags
        $abstractContent = '';
        if (!empty($submission->abstract)) {
            $abstractContent = strip_tags($submission->abstract);
            // Limit to reasonable length for Excel
            if (strlen($abstractContent) > 1000) {
                $abstractContent = substr($abstractContent, 0, 1000) . '...';
            }
        }

        // Format status
        $status = ucfirst($submission->status ?? 'pending');

        // Format submitted date
        $submittedAt = '';
        if ($submission->submitted_at) {
            $submittedAt = $submission->submitted_at->format('d/m/Y H:i');
        }

        // Format registration fee
        $registrationFee = '';
        if ($submission->registration_fee) {
            $registrationFee = 'USD ' . number_format($submission->registration_fee, 2);
        }

        // Payment required
        $paymentRequired = $submission->payment_required ? 'Yes' : 'No';

        // Reviewer notes
        $reviewerNotes = $submission->reviewer_notes ?? '';

        $data = [
            $no++,
            $submission->id,
            $submission->title ?? 'N/A',
            $authorName,
            $authorEmail,
            $authorPhone,
            $authorAffiliation,
            $countryName,
            $keywords,
            $contributorsText,
            $contributorAffiliationsText,
            $abstractContent,
            $status,
            $submittedAt,
            $registrationFee,
            $paymentRequired,
            $reviewerNotes
        ];

        return $data;
    }

    /**
     * Apply styles ke worksheet
     */
    public function styles(Worksheet $sheet)
    {
        // Style header row
        $sheet->getStyle('A1:Q1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
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
            $sheet->getStyle("A2:Q{$highestRow}")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_TOP,
                    'wrapText' => true,
                ],
                'font' => [
                    'size' => 10,
                ],
            ]);
        }

        // Set column widths for better readability
        $sheet->getColumnDimension('A')->setWidth(5);   // No
        $sheet->getColumnDimension('B')->setWidth(15);  // ID
        $sheet->getColumnDimension('C')->setWidth(40);  // Title
        $sheet->getColumnDimension('D')->setWidth(25);  // Author Name
        $sheet->getColumnDimension('E')->setWidth(25);  // Email
        $sheet->getColumnDimension('F')->setWidth(15);  // Phone
        $sheet->getColumnDimension('G')->setWidth(30);  // Author Affiliation
        $sheet->getColumnDimension('H')->setWidth(15);  // Country
        $sheet->getColumnDimension('I')->setWidth(30);  // Keywords
        $sheet->getColumnDimension('J')->setWidth(30);  // Contributors
        $sheet->getColumnDimension('K')->setWidth(35);  // Contributor Affiliations
        $sheet->getColumnDimension('L')->setWidth(50);  // Abstract Content
        $sheet->getColumnDimension('M')->setWidth(12);  // Status
        $sheet->getColumnDimension('N')->setWidth(18);  // Submitted At
        $sheet->getColumnDimension('O')->setWidth(15);  // Registration Fee
        $sheet->getColumnDimension('P')->setWidth(12);  // Payment Required
        $sheet->getColumnDimension('Q')->setWidth(30);  // Reviewer Notes

        // Auto-adjust row heights
        for ($row = 1; $row <= $highestRow; $row++) {
            $sheet->getRowDimension($row)->setRowHeight(-1);
        }

        return $sheet;
    }
}
