import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function Faqs({ faqs }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('question', question);
    form.append('answer', answer);

    fetch('/admin/faqs', {
      method: 'POST',
      body: form,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      fetch(`/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      }).then(() => {
        window.location.reload();
      });
    }
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
                    <tr key={faq.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 font-semibold">#{faq.id}</td>
                      <td className="py-3 px-4 text-gray-700">{faq.question}</td>
                      <td className="py-3 px-4 text-gray-700">{faq.answer}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <a
                            href={`/admin/faqs/${faq.id}/edit`}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </a>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
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
