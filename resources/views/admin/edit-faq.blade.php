<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit FAQ</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body>
    @include('admin.side-bar')

    <div class="content" style="padding:20px;">
        <h1>Edit FAQ</h1>

        <form action="{{ route('admin.faqs.update', $faq->faq_id) }}" method="POST">
            @csrf
            @method('PUT')

            <div>
                <label>Question:</label><br>
                <input type="text" name="question" value="{{ $faq->question }}" required style="width:100%; padding:8px; margin-bottom:10px;">
            </div>
            <div>
                <label>Answer:</label><br>
                <textarea name="answer" required style="width:100%; padding:8px; height:100px;">{{ $faq->answer }}</textarea>
            </div>
            <button type="submit" style="background:#3498db; border:none; padding:8px 14px; color:white;">
                Update FAQ
            </button>
        </form>
    </div>
</body>
</html>
