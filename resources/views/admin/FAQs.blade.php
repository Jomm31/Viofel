<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - FAQs</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fafc;
            color: #2d3748;
        }

        .content {
            flex-grow: 1;
            padding: 30px;
            background: #f8fafc;
            min-height: 100vh;
        }

        .header {
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 10px;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            margin-bottom: 25px;
            font-weight: 500;
        }

        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            overflow: hidden;
        }

        .card-header {
            background: #f7fafc;
            padding: 20px 25px;
            border-bottom: 1px solid #e2e8f0;
        }

        .card-header h2 {
            font-size: 1.4rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
        }

        .card-body {
            padding: 25px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #4a5568;
            font-size: 0.95rem;
        }

        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            background: white;
        }

        .form-control:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        textarea.form-control {
            resize: vertical;
            min-height: 120px;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: #4299e1;
            color: white;
        }

        .btn-primary:hover {
            background: #3182ce;
            transform: translateY(-1px);
        }

        .btn-danger {
            background: #e53e3e;
            color: white;
        }

        .btn-danger:hover {
            background: #c53030;
            transform: translateY(-1px);
        }

        .btn-edit {
            background: #38a169;
            color: white;
        }

        .btn-edit:hover {
            background: #2f855a;
            transform: translateY(-1px);
        }

        .table-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f7fafc;
            padding: 16px 20px;
            text-align: left;
            font-weight: 600;
            color: #4a5568;
            border-bottom: 1px solid #e2e8f0;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            color: #4a5568;
            font-size: 0.95rem;
        }

        tr:hover {
            background: #f7fafc;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .actions {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .btn-sm {
            padding: 8px 16px;
            font-size: 0.85rem;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #a0aec0;
            font-style: italic;
        }

        .answer-cell {
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 0;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            background: #f7fafc;
            padding: 20px 25px;
            border-bottom: 1px solid #e2e8f0;
            border-radius: 12px 12px 0 0;
        }

        .modal-header h2 {
            font-size: 1.4rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
        }

        .modal-body {
            padding: 25px;
        }

        .modal-footer {
            padding: 20px 25px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            background: #f7fafc;
            border-radius: 0 0 12px 12px;
        }

        .close {
            color: #a0aec0;
            float: right;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
            transition: color 0.3s ease;
        }

        .close:hover {
            color: #e53e3e;
        }

        @media (max-width: 768px) {
            .content {
                padding: 20px 15px;
            }

            .actions {
                flex-direction: column;
                gap: 8px;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }

            table {
                display: block;
                overflow-x: auto;
            }

            .answer-cell {
                max-width: 200px;
            }

            .modal-content {
                margin: 10% auto;
                width: 95%;
            }

            .modal-footer {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>

    <div style="display: flex; min-height: 100vh; width: 100%;">

        {{-- Sidebar --}}
        @include('admin.side-bar')

        {{-- Main Content --}}
        <div class="content">
            <div class="header">
                <h1>Manage FAQs</h1>
                <p style="color: #718096;">Add, edit, and manage frequently asked questions</p>
            </div>

            @if(session('success'))
                <div class="success-message">
                    {{ session('success') }}
                </div>
            @endif

            {{-- Add FAQ Form --}}
            <div class="card">
                <div class="card-header">
                    <h2>Add New FAQ</h2>
                </div>
                <div class="card-body">
                    <form action="{{ route('admin.faqs.store') }}" method="POST">
                        @csrf
                        <div class="form-group">
                            <label for="question">Question:</label>
                            <input type="text" id="question" name="question" class="form-control" placeholder="Enter the question..." required>
                        </div>
                        <div class="form-group">
                            <label for="answer">Answer:</label>
                            <textarea id="answer" name="answer" class="form-control" placeholder="Enter the answer..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <span>➕</span> Add FAQ
                        </button>
                    </form>
                </div>
            </div>

            {{-- List of FAQs --}}
            <div class="table-container">
                <div class="card-header">
                    <h2>Existing FAQs</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 80px;">ID</th>
                            <th>Question</th>
                            <th style="width: 40%;">Answer</th>
                            <th style="width: 150px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($faqs as $faq)
                        <tr>
                            <td style="font-weight: 600; color: #4299e1;">#{{ $faq->faq_id }}</td>
                            <td style="font-weight: 500;">{{ $faq->question }}</td>
                            <td class="answer-cell" title="{{ $faq->answer }}">{{ $faq->answer }}</td>
                            <td>
                                <div class="actions">
                                    <button 
                                        class="btn btn-edit btn-sm"
                                        data-id="{{ $faq->faq_id }}"
                                        data-question="{{ htmlspecialchars($faq->question, ENT_QUOTES) }}"
                                        data-answer="{{ htmlspecialchars($faq->answer, ENT_QUOTES) }}"
                                        onclick="openEditModal(this)">
                                        <span>✏️</span> Edit
                                    </button>

                                    <form action="{{ route('admin.faqs.destroy', $faq->faq_id) }}" method="POST" style="display: inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm" 
                                                onclick="return confirm('Are you sure you want to delete this FAQ?')">
                                            <span>🗑️</span> Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="no-data">
                                No FAQs found. Start by adding your first FAQ above.
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Edit FAQ Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit FAQ</h2>
                <span class="close" onclick="closeEditModal()">&times;</span>
            </div>
            <form id="editForm" method="POST">
                @csrf
                @method('PUT')
                <div class="modal-body">
                    <div class="form-group">
                        <label for="edit_question">Question:</label>
                        <input type="text" id="edit_question" name="question" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_answer">Answer:</label>
                        <textarea id="edit_answer" name="answer" class="form-control" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" onclick="closeEditModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <span>💾</span> Update FAQ
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openEditModal(button) {
            const faqId = button.dataset.id;
            const question = button.dataset.question;
            const answer = button.dataset.answer;

            const modal = document.getElementById('editModal');
            const form = document.getElementById('editForm');

            // Set form action dynamically
            form.action = "{{ route('admin.faqs.update', '') }}/" + faqId;

            // Fill modal inputs
            document.getElementById('edit_question').value = question;
            document.getElementById('edit_answer').value = answer;

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }


        function closeEditModal() {
            const modal = document.getElementById('editModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('editModal');
            if (event.target === modal) {
                closeEditModal();
            }
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeEditModal();
            }
        });

        // Auto-focus on first input when modal opens
        document.getElementById('editModal').addEventListener('shown', function() {
            document.getElementById('edit_question').focus();
        });
    </script>

</body>
</html>