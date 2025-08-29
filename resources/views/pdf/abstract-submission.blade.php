<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abstract - {{ $submission->title }}</title>
    <style>
        @page {
            margin: 2.5cm;
            size: A4;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #fff;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
            min-height: calc(100vh - 5cm);
            display: flex;
            flex-direction: column;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }

        .logo {
            width: 80px;
            height: auto;
            margin: 0 auto 20px;
            display: block;
        }

        .conference-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #333;
            letter-spacing: 1px;
        }

        .document-type {
            font-size: 14px;
            font-weight: normal;
            margin: 10px 0 0 0;
            color: #666;
        }

        .abstract-title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 30px 0 25px 0;
            color: #333;
            line-height: 1.4;
            padding: 0 20px;
        }

        .abstract-content {
            text-align: justify;
            line-height: 1.8;
            font-size: 12px;
            color: #333;
            margin: 25px 0;
            padding: 0 10px;
            flex-grow: 1;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
        }

        .abstract-content p {
            margin-bottom: 15px;
            text-indent: 0;
        }

        .abstract-content ul,
        .abstract-content ol {
            margin: 15px 0;
            padding-left: 20px;
        }

        .abstract-content li {
            margin-bottom: 5px;
        }

        .abstract-content strong {
            font-weight: bold;
        }

        .abstract-content em {
            font-style: italic;
        }

        .footer {
            margin-top: auto;
            padding-top: 15px;
            border-top: 1px solid #333;
            text-align: center;
            font-size: 10px;
            color: #666;
            page-break-inside: avoid;
        }

        /* Responsive font sizes for different content lengths */
        .long-content {
            font-size: 11px;
            line-height: 1.7;
        }

        .very-long-content {
            font-size: 10px;
            line-height: 1.6;
        }

        /* Print optimizations */
        @media print {
            body {
                font-size: 12px;
            }

            .abstract-content {
                font-size: 12px;
                line-height: 1.7;
            }

            .container {
                min-height: auto;
            }
        }

        /* Break long words */
        .break-word {
            word-break: break-all;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/assets/logo.png'))) }}"
                alt="ICMA UNSOED Logo" class="logo">
            <h1 class="conference-title">ICMA SURE 2025</h1>
            <h2 class="document-type">Abstract</h2>
        </div>

        <div class="abstract-title">
            {{ $submission->title }}
        </div>

        <div
            class="abstract-content {{ strlen(strip_tags($submission->abstract)) > 2000 ? 'very-long-content' : (strlen(strip_tags($submission->abstract)) > 1000 ? 'long-content' : '') }}">
            @php
                // Clean the HTML content but preserve basic formatting
                $abstractContent = $submission->abstract;

                // Remove any unwanted HTML tags but keep basic formatting
                $allowedTags = '<p><br><strong><em><b><i><ul><ol><li>';
                $abstractContent = strip_tags($abstractContent, $allowedTags);

                // Clean up any empty paragraphs
                $abstractContent = preg_replace('/<p[^>]*>\s*<\/p>/', '', $abstractContent);

                // If there's no HTML formatting, wrap in paragraphs
if (strip_tags($abstractContent) === $abstractContent && !empty(trim($abstractContent))) {
    $paragraphs = preg_split('/\r\n|\r|\n/', trim($abstractContent));
    $paragraphs = array_filter($paragraphs, function ($p) {
        return trim($p) !== '';
    });

    $abstractContent = '';
    foreach ($paragraphs as $paragraph) {
        if (!empty(trim($paragraph))) {
            $abstractContent .= '<p>' . htmlspecialchars(trim($paragraph)) . '</p>';
                        }
                    }
                }
            @endphp

            {!! $abstractContent !!}
        </div>

        <div class="footer">
            Created on {{ now()->format('F d, Y H:i:s') }} | ICMA SURE 2025
        </div>
    </div>
</body>

</html>
