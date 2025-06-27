import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Loader2, AlertCircle, PlusCircle, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const initialForm = {
  billingPeriodStart: '',
  billingPeriodEnd: '',
  roomFee: '',
  utilitiesFee: '',
  lateFee: '',
  totalAmount: '',
  status: 'pending',
};

const ResidentBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found.');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get('https://hostel-management-fws2.onrender.com/api/billing/my-bills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch billing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (
      ['roomFee', 'utilitiesFee', 'lateFee'].includes(name)
    ) {
      setForm((prev) => ({
        ...prev,
        totalAmount:
          Number(name === 'roomFee' ? value : prev.roomFee || 0) +
          Number(name === 'utilitiesFee' ? value : prev.utilitiesFee || 0) +
          Number(name === 'lateFee' ? value : prev.lateFee || 0),
      }));
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found.');
      setSubmitting(false);
      return;
    }
    try {
      await axios.post(
        'https://hostel-management-fws2.onrender.com/api/billing/create',
        {
          ...form,
          roomFee: Number(form.roomFee),
          utilitiesFee: Number(form.utilitiesFee),
          lateFee: Number(form.lateFee),
          totalAmount: Number(form.totalAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Bill created successfully!');
      setShowModal(false);
      setForm(initialForm);
      fetchBills();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create bill.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex items-center gap-3 flex-1">
            <FileText size={32} className="text-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold">My Billing Records</h2>
          </div>
          <button
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => setShowModal(true)}
          >
            <PlusCircle size={20} /> <span className="hidden sm:inline">Create Bill</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center mt-20">
            <Loader2 className="animate-spin h-10 w-10 text-yellow-400 mb-3" />
            <p>Loading your billing history...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center text-red-400 mt-10">
            <AlertCircle className="mx-auto mb-2" size={36} />
            <p>No billing records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700 shadow">
            <table className="w-full text-sm bg-gray-800 text-gray-300">
              <thead className="bg-gray-700 text-yellow-400 text-left">
                <tr>
                  <th className="px-4 py-3">Billing Period</th>
                  <th className="px-4 py-3">Room Fee</th>
                  <th className="px-4 py-3">Utilities</th>
                  <th className="px-4 py-3">Late Fee</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(bill.billingPeriodStart).toLocaleDateString()} -{' '}
                      {new Date(bill.billingPeriodEnd).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">₹{bill.roomFee}</td>
                    <td className="px-4 py-2 whitespace-nowrap">₹{bill.utilitiesFee}</td>
                    <td className="px-4 py-2 whitespace-nowrap">₹{bill.lateFee}</td>
                    <td className="px-4 py-2 font-semibold text-white whitespace-nowrap">₹{bill.totalAmount}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          bill.status === 'paid'
                            ? 'bg-green-600 text-white'
                            : bill.status === 'pending'
                            ? 'bg-yellow-500 text-black'
                            : bill.status === 'overdue'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-500'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Creating Bill */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-2 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400 text-center">Create New Bill</h3>
              <form onSubmit={handleCreateBill} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block mb-1">Billing Period Start</label>
                    <input
                      type="date"
                      name="billingPeriodStart"
                      value={form.billingPeriodStart}
                      onChange={handleInput}
                      required
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Billing Period End</label>
                    <input
                      type="date"
                      name="billingPeriodEnd"
                      value={form.billingPeriodEnd}
                      onChange={handleInput}
                      required
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block mb-1">Room Fee (₹)</label>
                    <input
                      type="number"
                      name="roomFee"
                      value={form.roomFee}
                      onChange={handleInput}
                      required
                      min="0"
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Utilities Fee (₹)</label>
                    <input
                      type="number"
                      name="utilitiesFee"
                      value={form.utilitiesFee}
                      onChange={handleInput}
                      required
                      min="0"
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block mb-1">Late Fee (₹)</label>
                    <input
                      type="number"
                      name="lateFee"
                      value={form.lateFee}
                      onChange={handleInput}
                      required
                      min="0"
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Total Amount (₹)</label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={form.totalAmount}
                      onChange={handleInput}
                      required
                      min="0"
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInput}
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded mt-2 transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {submitting ? 'Creating...' : 'Create Bill'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentBilling;
