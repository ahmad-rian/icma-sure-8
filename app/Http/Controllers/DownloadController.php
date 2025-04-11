<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DownloadController extends Controller
{
    /**
     * Handle file downloads
     */
    public function downloadFile(string $file): BinaryFileResponse
    {
        // Validasi file yang diizinkan untuk didownload
        $allowedFiles = [
            'abstract-template' => [
                'path' => 'assets/download/abstract-template.docx',
                'name' => 'Template Abstract ICMA 8.docx'
            ],
            'icma-sure-proceeding' => [
                'path' => 'assets/download/icma-sure-proceeding.docx',
                'name' => 'Template Artikel ICMA 8.docx'
            ],

        ];

        // Periksa apakah file yang diminta ada dalam daftar yang diizinkan
        if (!array_key_exists($file, $allowedFiles)) {
            abort(404, 'File tidak ditemukan');
        }

        $fileInfo = $allowedFiles[$file];
        $filePath = public_path($fileInfo['path']);

        // Periksa apakah file benar-benar ada di server
        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan di server');
        }

        // Kembalikan response download dengan nama file yang sesuai
        return response()->download($filePath, $fileInfo['name']);
    }
}
