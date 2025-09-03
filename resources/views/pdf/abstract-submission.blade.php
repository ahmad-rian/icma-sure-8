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
            font-size: 11px;
            line-height: 1.5;
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
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
        }

        .logo {
            width: 70px;
            height: auto;
            margin: 0 auto 15px;
            display: block;
        }

        .conference-title {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 8px 0;
            color: #333;
            letter-spacing: 1px;
        }

        .document-type {
            font-size: 12px;
            font-weight: normal;
            margin: 8px 0 0 0;
            color: #666;
        }

        .submission-info {
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }

        .info-row {
            display: flex;
            margin-bottom: 8px;
        }

        .info-row:last-child {
            margin-bottom: 0;
        }

        .info-label {
            font-weight: bold;
            width: 120px;
            flex-shrink: 0;
        }

        .info-value {
            flex: 1;
        }

        .abstract-title {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0 15px 0;
            color: #333;
            line-height: 1.4;
            padding: 0 15px;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
        }

        .authors-section {
            background: #f8f9fa;
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 3px;
        }

        .author-item {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
        }

        .author-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        .author-name {
            font-weight: bold;
            color: #333;
        }

        .author-details {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
        }

        .keywords {
            background: #e3f2fd;
            padding: 8px;
            border-radius: 3px;
            font-style: italic;
        }

        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-pending {
            background: #fff3cd;
            color: #856404;
        }

        .status-approved {
            background: #d4edda;
            color: #155724;
        }

        .status-rejected {
            background: #f8d7da;
            color: #721c24;
        }

        .abstract-content {
            text-align: justify;
            line-height: 1.6;
            font-size: 11px;
            color: #333;
            margin: 15px 0;
            padding: 12px;
            background: #fafafa;
            border-radius: 3px;
            flex-grow: 1;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
        }

        .abstract-content p {
            margin-bottom: 12px;
            text-indent: 0;
        }

        .abstract-content ul,
        .abstract-content ol {
            margin: 12px 0;
            padding-left: 18px;
        }

        .abstract-content li {
            margin-bottom: 4px;
        }

        .abstract-content strong {
            font-weight: bold;
        }

        .abstract-content em {
            font-style: italic;
        }

        .footer {
            margin-top: auto;
            padding-top: 12px;
            border-top: 1px solid #333;
            text-align: center;
            font-size: 9px;
            color: #666;
            page-break-inside: avoid;
        }

        .payment-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        .review-info {
            background: #e2e3e5;
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        /* Print optimizations */
        @media print {
            body {
                font-size: 11px;
            }

            .abstract-content {
                font-size: 11px;
                line-height: 1.6;
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
            <h2 class="document-type">Abstract Submission</h2>
        </div>

        {{-- <!-- Submission Information -->
        <div class="submission-info">
            <div class="info-row">
                <div class="info-label">Submission ID:</div>
                <div class="info-value">{{ $submission->id }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value">
                    <span class="status-badge status-{{ $submission->status }}">
                        {{ ucfirst($submission->status) }}
                    </span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">Submitted:</div>
                <div class="info-value">{{ $submission->submitted_at ? $submission->submitted_at->format('F d, Y H:i:s') : 'Not submitted' }}</div>
            </div>
            @if ($submission->reviewed_at)
            <div class="info-row">
                <div class="info-label">Reviewed:</div>
                <div class="info-value">{{ $submission->reviewed_at->format('F d, Y H:i:s') }}</div>
            </div>
            @endif
            @if ($submission->reviewer)
            <div class="info-row">
                <div class="info-label">Reviewed by:</div>
                <div class="info-value">{{ $submission->reviewer->name }}</div>
            </div>
            @endif
            @if ($submission->country)
            <div class="info-row">
                <div class="info-label">Country:</div>
                <div class="info-value">{{ $submission->country->name }}</div>
            </div>
            @endif
        </div> --}}

        <!-- Abstract Title -->
        <div class="abstract-title">
            {{ $submission->title }}
        </div>

        <!-- Authors Section -->
        <div class="section">
            <div class="section-title">Authors</div>
            <div class="authors-section">
                <!-- Main Author -->
                <div class="author-item">
                    <div class="author-name">
                        {{ $submission->user->name }} (Main Author)
                    </div>
                    <div class="author-details">
                        Email: {{ $submission->user->email }}
                        @if ($submission->author_phone_number)
                            | Phone: {{ $submission->author_phone_number }}
                        @elseif($submission->user->phone_number)
                            | Phone: {{ $submission->user->phone_number }}
                        @elseif($submission->user->profile && $submission->user->profile->phone)
                            | Phone: {{ $submission->user->profile->phone }}
                        @endif
                        @if ($submission->user->profile)
                            @if ($submission->user->profile->affiliation)
                                <br>Affiliation: {{ $submission->user->profile->affiliation }}
                            @endif
                            @if ($submission->user->profile->country)
                                | Country: {{ $submission->user->profile->country->name }}
                            @endif
                        @endif
                    </div>
                </div>

                <!-- Contributors -->
                @if ($submission->contributors && $submission->contributors->count() > 0)
                    @foreach ($submission->contributors as $contributor)
                        <div class="author-item">
                            <div class="author-name">
                                {{ $contributor->first_name }} {{ $contributor->last_name }}
                                @if ($contributor->is_primary_contact)
                                    (Primary Contact)
                                @endif
                            </div>
                            <div class="author-details">
                                Email: {{ $contributor->email }}
                                @if ($contributor->phone_number)
                                    | Phone: {{ $contributor->phone_number }}
                                @endif
                                <br>Affiliation: {{ $contributor->affiliation }}
                                @if ($contributor->country)
                                    | Country: {{ $contributor->country->name }}
                                @endif
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

        <!-- Keywords -->
        @if ($submission->keywords && count($submission->keywords) > 0)
            <div class="section">
                <div class="section-title">Keywords</div>
                <div class="keywords">
                    {{ implode(', ', $submission->keywords) }}
                </div>
            </div>
        @endif

        <!-- Abstract Content -->
        <div class="section">
            <div class="section-title">Abstract</div>
            <div class="abstract-content">
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
        </div>

        <!-- Payment Information -->
        @if ($submission->payment_required || $submission->registration_fee)
            <div class="section">
                <div class="section-title">Payment Information</div>
                <div class="payment-info">
                    @if ($submission->registration_fee)
                        <div class="info-row">
                            <div class="info-label">Registration Fee:</div>
                            <div class="info-value">IDR {{ number_format($submission->registration_fee, 0, ',', '.') }}
                            </div>
                        </div>
                    @endif
                    @if ($submission->payment)
                        <div class="info-row">
                            <div class="info-label">Payment Status:</div>
                            <div class="info-value">
                                <span class="status-badge status-{{ $submission->payment->status }}">
                                    {{ ucfirst($submission->payment->status) }}
                                </span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Amount:</div>
                            <div class="info-value">IDR {{ number_format($submission->payment->amount, 0, ',', '.') }}
                            </div>
                        </div>
                        @if ($submission->payment->uploaded_at)
                            <div class="info-row">
                                <div class="info-label">Payment Uploaded:</div>
                                <div class="info-value">{{ $submission->payment->uploaded_at }}</div>
                            </div>
                        @endif
                    @endif
                </div>
            </div>
        @endif

        <!-- Review Information -->
        @if ($submission->reviewer_notes)
            <div class="section">
                <div class="section-title">Review Notes</div>
                <div class="review-info">
                    {{ $submission->reviewer_notes }}
                </div>
            </div>
        @endif

        <div class="footer">
            <div>Generated on {{ now()->format('F d, Y H:i:s') }}</div>
            <div>ICMA-SURE 2025 | Faculty of Agriculture, Universitas Jenderal Soedirman</div>
        </div>
    </div>
</body>

</html>
