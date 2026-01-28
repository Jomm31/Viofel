import React from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { router } from '@inertiajs/react';

export default function Inquiries({ inquiries }) {
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      router.delete(`/admin/inquiries/${id}`);
    }
  };

  return (
    <AdminLayout title="Customer Inquiries">
      <div className="py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Customer Inquiries</h1>
          <p className="text-gray-600">View and manage customer inquiries</p>
        </div>

        <div className="mb-4">
          <span className="text-gray-600">Total inquiries: {inquiries?.length || 0}</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Inquiries</h2>
          
          {inquiries && inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.message_id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* ID & Customer Info */}
                    <div>
                      <p className="text-blue-600 font-bold text-lg mb-2">ID: #{inquiry.message_id}</p>
                      <p className="text-gray-600"><strong>Date:</strong> {new Date(inquiry.created_at).toLocaleDateString()}</p>
                      <p className="text-gray-600"><strong>Name:</strong> {inquiry.name}</p>
                      <p className="text-gray-600"><strong>Email:</strong> {inquiry.email}</p>
                      <p className="text-gray-600"><strong>Phone:</strong> {inquiry.contact_number}</p>
                    </div>

                    {/* Message */}
                    <div className="bg-white p-3 rounded border md:col-span-2">
                      <p className="font-semibold text-gray-700 mb-2">Message:</p>
                      <p className="text-gray-600">{inquiry.message}</p>
                    </div>

                    {/* Attachment & Actions */}
                    <div className="flex flex-col gap-3">
                      {inquiry.attachment ? (
                        <div className="bg-white p-2 rounded border">
                          <p className="font-semibold text-gray-700 mb-2 text-sm">Attachment:</p>
                          <a 
                            href={`/storage/${inquiry.attachment}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img 
                              src={`/storage/${inquiry.attachment}`} 
                              alt="Inquiry Attachment" 
                              className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                              onError={(e) => { 
                                e.target.style.display = 'none'; 
                                e.target.parentElement.innerHTML = '<div class="bg-gray-100 p-4 rounded text-center text-gray-600 text-sm">📎 View Attachment</div>'; 
                              }}
                            />
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-3 rounded text-center text-gray-500 text-sm">
                          No attachment
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(inquiry.message_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No inquiries found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
