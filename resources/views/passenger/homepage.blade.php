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


    {{-- FAQ Section --}}
    <div class="faq-container">
    <div class="faq-header">About Us (Frequently Asked Questions)</div>

    @forelse($faqs as $faq)
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
                {{ $faq->question }}
                <span>▼</span>
            </div>
            <div class="faq-answer">
                {{ $faq->answer }}
            </div>
        </div>
    @empty
        <p>No FAQs available right now.</p>
    @endforelse
</div>
    <script>
        function toggleFaq(element) {
            const faqItem = element.parentElement;
            const answer = element.nextElementSibling;
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                    item.querySelector('.faq-answer').style.padding = '0 30px';
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
            
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '20px 30px';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0 30px';
            }
        }

        // Optional: Auto-open first FAQ item
        document.addEventListener('DOMContentLoaded', function() {
            const firstFaq = document.querySelector('.faq-item');
            if (firstFaq) {
                firstFaq.classList.add('active');
                const firstAnswer = firstFaq.querySelector('.faq-answer');
                firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
                firstAnswer.style.padding = '20px 30px';
            }
        });
    </script>


</body>
</html>
