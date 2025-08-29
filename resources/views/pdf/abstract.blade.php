<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abstract - {{ $submission->title }}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }

        .conference-title {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .conference-subtitle {
            font-size: 14pt;
            margin-bottom: 5px;
        }

        .conference-date {
            font-size: 12pt;
            font-style: italic;
        }

        .abstract-title {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            margin: 30px 0 20px 0;
            text-transform: uppercase;
        }

        .author-info {
            text-align: center;
            margin-bottom: 20px;
        }

        .author-name {
            font-weight: bold;
            font-size: 12pt;
        }

        .author-email {
            font-style: italic;
            margin-top: 5px;
        }

        .contributors {
            margin-top: 10px;
            font-size: 11pt;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .content {
            text-align: justify;
            text-indent: 20px;
        }

        .keywords {
            font-style: italic;
        }

        .footer {
            margin-top: 40px;
            border-top: 1px solid #ccc;
            padding-top: 20px;
            font-size: 10pt;
            text-align: center;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/assets/logo.png'))) }}"
            alt="ICMA UNSOED Logo" class="logo">
        <div class="conference-title">
            8th International Conference on Multidisciplinary Approaches<br>
            for Sustainable Rural Development
        </div>
        <div class="conference-subtitle">
            (ICMA-SURE) 2025
        </div>
        <div class="conference-date">
            October 7, 2025 | Virtual Conference via Zoom
        </div>
    </div>

    <div class="abstract-title">
        {{ $submission->title }}
    </div>

    <div class="author-info">
        <div class="author-name">
            {{ $submission->user->profile->full_name ?? $submission->user->name }}
        </div>
        <div class="author-email">
            {{ $submission->email }}
        </div>
        @if ($submission->country)
            <div style="margin-top: 5px;">
                <strong>Country:</strong> {{ $submission->country->name }}
            </div>
        @endif
        @if ($contributors)
            <div class="contributors">
                <strong>Contributors:</strong><br>
                {{ $contributors }}
            </div>
        @endif
    </div>

    @if ($submission->keywords)
        <div class="section">
            <div class="section-title">Keywords</div>
            <div class="keywords">
                {{ $submission->keywords }}
            </div>
        </div>
    @endif

    <div class="section">
        <div class="section-title">Abstract</div>
        <div class="content">
            {!! nl2br(e($submission->abstract_content)) !!}
        </div>
    </div>

    <div class="footer">
        <div>
            Submitted on: {{ $submission->created_at->format('F d, Y') }}
        </div>
        <div>
            Submission ID: {{ $submission->id }}
        </div>
        <div style="margin-top: 10px;">
            ICMA-SURE 2025 | Faculty of Agriculture, Universitas Jenderal Soedirman
        </div>
    </div>
</body>

</html>
