import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments] = useState([
    {
      id: 'pay_001',
      orderId: 'order_Nx8Yq92J10kL',
      paymentId: 'pay_K7h2Nm90AqL1',
      patientName: 'Ramesh Patil',
      amount: 500,
      currency: 'INR',
      status: 'VERIFIED',
      appointmentCode: 'SMH-2026-000101',
      timestamp: '2026-08-20 10:15 AM',
    },
    {
      id: 'pay_002',
      orderId: 'order_Nx8Yq92J10kM',
      paymentId: 'pay_K7h2Nm90AqL2',
      patientName: 'Sunita Deshmukh',
      amount: 500,
      currency: 'INR',
      status: 'VERIFIED',
      appointmentCode: 'SMH-2026-000102',
      timestamp: '2026-08-20 10:45 AM',
    },
    {
      id: 'pay_003',
      orderId: 'order_Nx8Yq92J10kN',
      paymentId: 'pay_K7h2Nm90AqL3',
      patientName: 'Ganesh Shinde',
      amount: 400,
      currency: 'INR',
      status: 'VERIFIED',
      appointmentCode: 'SMH-2026-000103',
      timestamp: '2026-08-20 11:20 AM',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-stone-900">Payments</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Online consultation fees received through the booking page.
          </p>
        </div>

      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-card-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Transaction / Order ID</th>
                <th className="py-3 px-4">Appointment ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-stone-900">{p.paymentId}</p>
                    <p className="text-[10px] text-stone-400">{p.orderId}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-hospital-teal">{p.appointmentCode}</td>
                  <td className="py-3.5 px-4 font-medium text-stone-800">{p.patientName}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">₹{p.amount}</td>
                  <td className="py-3.5 px-4 text-stone-500">{p.timestamp}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{p.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
