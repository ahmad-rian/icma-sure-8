<?php

namespace App\Services;

use App\Models\AbstractSubmission;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PdfGenerationService
{
    /**
     * Generate PDF for abstract submission
     */
    public function generateAbstractPdf(AbstractSubmission $submission): string
    {
        // Load submission with relations
        $submission->load(['user.profile', 'contributors', 'country']);
        
        // Generate PDF content
        $html = $this->generateAbstractHtml($submission);
        
        // Create PDF
        $pdf = Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont' => 'sans-serif',
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
            ]);
        
        // Generate filename
        $filename = $this->generateFilename($submission);
        
        // Save to storage
        $pdfContent = $pdf->output();
        Storage::disk('public')->put("abstracts/{$filename}", $pdfContent);
        
        return $filename;
    }

    /**
     * Regenerate PDF for abstract submission
     */
    public function regenerateAbstractPdf(AbstractSubmission $submission): string
    {
        // Delete old PDF if exists
        if ($submission->abstract_pdf) {
            $this->deletePdf($submission->abstract_pdf);
        }
        
        // Generate new PDF
        return $this->generateAbstractPdf($submission);
    }
    
    /**
     * Generate HTML content for abstract PDF
     */
    private function generateAbstractHtml(AbstractSubmission $submission): string
    {
        return view('pdf.abstract-submission', [
            'submission' => $submission,
        ])->render();
    }
    
    /**
     * Generate filename for PDF
     */
    private function generateFilename(AbstractSubmission $submission): string
    {
        $title = Str::slug($submission->title, '-');
        $title = Str::limit($title, 50, '');
        
        return "abstract-{$title}.pdf";
    }
    
    /**
     * Get PDF path
     */
    public function getPdfPath(string $filename): string
    {
        return Storage::disk('public')->path("abstracts/{$filename}");
    }
    
    /**
     * Get PDF URL
     */
    public function getPdfUrl(string $filename): string
    {
        return asset("storage/abstracts/{$filename}");
    }
    
    /**
     * Check if PDF exists
     */
    public function pdfExists(string $filename): bool
    {
        return Storage::disk('public')->exists("abstracts/{$filename}");
    }
    
    /**
     * Delete PDF file
     */
    public function deletePdf(string $filename): bool
    {
        return Storage::disk('public')->delete("abstracts/{$filename}");
    }
}