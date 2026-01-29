import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { router } from '@inertiajs/react';

export default function Faqs({ faqs }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    fetch('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify({ question, answer }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setQuestion('');
          setAnswer('');
          router.reload();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add FAQ');
      })
      .finally(() => setProcessing(false));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      fetch(`/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            router.reload();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Failed to delete FAQ');
        });
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq.faq_id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');
  };

  const handleUpdate = (id) => {
    setProcessing(true);

    fetch(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ question: editQuestion, answer: editAnswer }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEditingId(null);
          setEditQuestion('');
          setEditAnswer('');
          router.reload();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to update FAQ');
      })
      .finally(() => setProcessing(false));
  };

  return (
    <AdminLayout title="Manage FAQs">
      <div className="py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage FAQs</h1>
          <p className="text-gray-600">Add, edit, and manage frequently asked questions</p>
        </div>

        {/* Add New FAQ Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New FAQ</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Question:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Answer:</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add FAQ
            </button>
          </form>
        </div>

        {/* Existing FAQs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing FAQs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">QUESTION</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">ANSWER</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {faqs && faqs.length > 0 ? (
                  faqs.map((faq) => (
                    <tr key={faq.faq_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 font-semibold">#{faq.faq_id}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {editingId === faq.faq_id ? (
                          <input
                            type="text"
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          faq.question
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {editingId === faq.faq_id ? (
                          <textarea
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          faq.answer
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          {editingId === faq.faq_id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(faq.faq_id)}
                                disabled={processing}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                {processing ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={processing}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(faq)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(faq.faq_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No FAQs found. Add your first FAQ above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
