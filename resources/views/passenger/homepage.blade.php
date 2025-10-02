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

    {{-- FAQ Section --}}
    <div class="faq-container">
        <div class="faq-header">
            <h1>About Us</h1>
            <p>Frequently Asked Questions</p>
        </div>

        <div class="faq-content">
            @forelse($faqs as $index => $faq)
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span class="faq-question-number">{{ $index + 1 }}</span>
                        {{ $faq->question }}
                        <span>▼</span>
                    </div>
                    <div class="faq-answer">
                        {{ $faq->answer }}
                    </div>
                </div>
            @empty
                <div class="no-faqs">
                    <p>No FAQs available at the moment.</p>
                    <p style="font-size: 0.9rem; color: #a0aec0;">Check back later for updates.</p>
                </div>
            @endforelse
        </div>
    </div>


       <script>
        function toggleFaq(element) {
            const faqItem = element.parentElement;
            const answer = element.nextElementSibling;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const itemAnswer = item.querySelector('.faq-answer');
                itemAnswer.style.maxHeight = '0';
                itemAnswer.style.padding = '0 40px';
            });
            
            // If clicked item wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                 answer.style.padding = '20px 40px 30px 40px';
            }
        }

        // Auto-open first FAQ item
        document.addEventListener('DOMContentLoaded', function() {
            const firstFaq = document.querySelector('.faq-item');
            if (firstFaq) {
                const firstAnswer = firstFaq.querySelector('.faq-answer');
                firstFaq.classList.add('active');
                firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
                firstAnswer.style.padding = '20px 40px 30px 40px';
            }
        });
    </script>

</body>
</html>
