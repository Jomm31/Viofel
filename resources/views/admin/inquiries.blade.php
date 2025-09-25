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
        <div class="inquiry-content">
            <!-- Left column: info -->
            <div class="inquiry-info">
                <p><strong>Date:</strong> {{ $inquiry->created_at->format('m/d/Y') }}</p>
                <p><strong>Name:</strong> {{ $inquiry->name }}</p>
                <p><strong>Email:</strong> {{ $inquiry->email }}</p>
                <p><strong>Phone:</strong> {{ $inquiry->contact_number }}</p>
            </div>

            <!-- Middle column: message -->
            <div class="inquiry-message">
                <p><strong>Message:</strong></p>
                <p>{{ $inquiry->message }}</p>
            </div>

            <!-- Right column: attachment + delete -->
            <div class="inquiry-attachment">
                @if($inquiry->attachment)
                    @php
                        $extension = pathinfo($inquiry->attachment, PATHINFO_EXTENSION);
                    @endphp

                    @if(in_array($extension, ['jpg','jpeg','png','gif']))
                        <a href="{{ asset('storage/' . $inquiry->attachment) }}" target="_blank">
                            <img src="{{ asset('storage/' . $inquiry->attachment) }}" alt="Attachment">
                        </a>
                    @else
                        <a href="{{ asset('storage/' . $inquiry->attachment) }}" target="_blank">
                            Download ({{ strtoupper($extension) }})
                        </a>
                    @endif
                @endif

                <!-- Delete Button -->
                <form action="{{ route('inquiries.destroy', $inquiry->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this inquiry?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="delete-btn">Delete</button>
                </form>
            </div>
        </div>
    </div>
@endforeach




        </div>
    </div>
</body>
</html>
