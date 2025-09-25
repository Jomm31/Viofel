<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Homepage')</title>
    <link rel="stylesheet" href="{{ asset('css/homepage.css') }}">
</head>
<body>
<form action="{{ route('inquiries.store') }}" method="POST" enctype="multipart/form-data">
    @csrf

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="form-container">
        {{-- Left Section --}}
        <div class="left">
            <h3>CONTACT US</h3>

            <label for="name">Name</label>
            <input type="text" name="name" id="name" placeholder="e.x. Totoy Batumbakal" required>

            <label for="email">Email</label>
            <input type="email" name="email" id="email" placeholder="e.x. TotoyBatumbakal@gmail.com" required>

            <label for="contact_number">Contact Number</label>
            <input type="text" name="contact_number" id="contact_number" placeholder="e.x. 09123456789">

            <button type="submit">Send Message</button>
        </div>

        {{-- Right Section --}}
        <div class="right">
            <label for="message">Message</label>
            <textarea name="message" id="message" placeholder="Type your message here..."></textarea>

            <label for="attachment">Attachment</label>
            <input type="file" name="attachment" id="attachment">
        </div>
    </div>
</form>

</body>
</html>
