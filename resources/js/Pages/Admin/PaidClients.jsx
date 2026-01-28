import React from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function PaidClients({ invoices }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <AdminLayout title="Paid Clients">
      <div className="py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Paid Clients</h1>
          <p className="text-gray-600">View all clients with confirmed payments</p>
        </div>

        <div className="mb-4">
          <span className="text-gray-600">Total paid clients: {invoices?.length || 0}</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Invoice #</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Booking Ref</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Route</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {invoices && invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.invoice_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 font-bold">
                        {invoice.invoice_number}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {invoice.calculated_cost?.reservation?.booking_reference?.booking_reference || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {invoice.calculated_cost?.reservation?.customer?.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {invoice.calculated_cost?.reservation?.customer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {invoice.calculated_cost?.reservation?.origin} → {invoice.calculated_cost?.reservation?.destination}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {invoice.calculated_cost?.reservation?.reservation_date 
                          ? new Date(invoice.calculated_cost.reservation.reservation_date).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {invoice.issued_at ? new Date(invoice.issued_at).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No paid clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {invoices && invoices.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Revenue:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(invoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
