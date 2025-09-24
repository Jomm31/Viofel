<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Customer Inquiries</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body>
    
    <div class="container">
        {{-- Sidebar --}}
        @include('admin.side-bar')

        {{-- Main Content --}}
        <div class="main-content">


            <p>Total inquiries: {{ $inquiries->count() }}</p>

            <h2>Customer Inquiries</h2>

        @foreach($inquiries as $inquiry)
            <div class="inquiry-box">
                <p><strong>Date:</strong> {{ $inquiry->created_at->format('m/d/Y') }}</p>
                <p><strong>Name:</strong> {{ $inquiry->name }}</p>
                <p><strong>Email:</strong> {{ $inquiry->email }}</p>
                <p><strong>Phone:</strong> {{ $inquiry->contact_number }}</p>
                <p><strong>Message:</strong> {{ $inquiry->message }}</p>

                @if($inquiry->attachment)
                    <div class="attachment">
                        <strong>Attachment:</strong><br>
                        <img src="{{ asset('storage/' . $inquiry->attachment) }}" alt="Attachment">
                    </div>
                @endif
            </div>
        @endforeach


        </div>
    </div>
</body>
</html>
