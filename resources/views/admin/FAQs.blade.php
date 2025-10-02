<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - FAQs</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: Arial, sans-serif;
        }

        .content {
            flex-grow: 1;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table, th, td {
            border: 1px solid #ddd;
            padding: 10px;
        }
        th {
            background: #f4f4f4;
        }
        .btn {
            padding: 6px 12px;
            border: none;
            cursor: pointer;
            color: #fff;
        }
        .btn-danger { background: #e74c3c; }
        .btn-primary { background: #3498db; }
    </style>
</head>
<body>

    <div style="display: flex; min-height: 100vh;">

        {{-- Sidebar --}}
        @include('admin.side-bar')

        {{-- Main Content --}}
        <div class="content" style="flex-grow: 1; padding: 20px;">
            <h1>Manage FAQs</h1>

            @if(session('success'))
                <div style="color: green; margin-bottom: 10px;">
                    {{ session('success') }}
                </div>
            @endif

            {{-- Add FAQ Form --}}
            <form action="{{ route('admin.faqs.store') }}" method="POST" style="margin-bottom: 20px;">
                @csrf
                <div>
                    <label>Question:</label><br>
                    <input type="text" name="question" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                </div>
                <div>
                    <label>Answer:</label><br>
                    <textarea name="answer" required style="width: 100%; padding: 8px; height: 100px;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="background:#3498db; border:none; padding:8px 14px; color:white;">
                    Add FAQ
                </button>
            </form>

            {{-- List of FAQs --}}
            <h2>Existing FAQs</h2>
            <table style="width:100%; border-collapse: collapse; margin-top:10px;">
                <tr style="background:#f4f4f4;">
                    <th style="border:1px solid #ddd; padding:8px;">ID</th>
                    <th style="border:1px solid #ddd; padding:8px;">Question</th>
                    <th style="border:1px solid #ddd; padding:8px;">Answer</th>
                    <th style="border:1px solid #ddd; padding:8px;">Action</th>
                </tr>
                @foreach($faqs as $faq)
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">{{ $faq->faq_id }}</td>
                    <td style="border:1px solid #ddd; padding:8px;">{{ $faq->question }}</td>
                    <td style="border:1px solid #ddd; padding:8px;">{{ $faq->answer }}</td>
                    <td style="border:1px solid #ddd; padding:8px;">
                        <form action="{{ route('admin.faqs.destroy', $faq->faq_id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" style="background:#e74c3c; border:none; color:white; padding:6px 10px; cursor:pointer;" onclick="return confirm('Delete this FAQ?')">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>

</body>
</html>