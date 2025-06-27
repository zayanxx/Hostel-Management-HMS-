/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import {
  Loader2, PlusCircle, Trash2, DollarSign, User, FileText, CreditCard, ReceiptText, ClipboardList
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const API = 'https://hostel-management-fws2.onrender.com/api/payment';

const initialForm = {
  resident: '',
  billing: '',
  invoice: '',
  amountPaid: '',
  paymentMethod: 'cash',
  transactionId: '',
  remarks: ''
};

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API);
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amountPaid' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!form.resident || !form.billing || !form.amountPaid) {
        toast.error('Please fill all required fields');
        return;
      }
      await axios.post(API, { ...form, amountPaid: Number(form.amountPaid) });
      toast.success('Payment recorded!');
      setForm(initialForm);
      fetchPayments();
    } catch {
      toast.error('Error recording payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this payment?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success('Payment deleted!');
      fetchPayments();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div
      className="min-h-screen p-6 text-sm text-gray-800"
      style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}
    >
      <ToastContainer position="top-right" />

      <motion.h1
        className="text-white text-3xl font-bold mb-8 flex items-center gap-3 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DollarSign size={32} className="text-green-400" />
        Manage Payments
      </motion.h1>

      {/* Payment Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 backdrop-blur-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex gap-2 items-center">
          <PlusCircle className="text-green-600" /> Record New Payment
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Input with Icon */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              name="resident"
              type="text"
              value={form.resident}
              onChange={handleChange}
              placeholder="Resident ID"
              required
              className="w-full pl-10 p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              name="billing"
              type="text"
              value={form.billing}
              onChange={handleChange}
              placeholder="Billing ID"
              required
              className="w-full pl-10 p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <ReceiptText className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              name="invoice"
              type="text"
              value={form.invoice}
              onChange={handleChange}
              placeholder="Invoice ID (optional)"
              className="w-full pl-10 p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              name="amountPaid"
              type="number"
              min="0"
              step="0.01"
              value={form.amountPaid}
              onChange={handleChange}
              placeholder="Amount Paid"
              required
              className="w-full pl-10 p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 text-gray-500" size={18} />
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
            >
              {['cash', 'card', 'online', 'upi', 'other'].map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ClipboardList className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              name="transactionId"
              type="text"
              value={form.transactionId}
              onChange={handleChange}
              placeholder="Transaction ID"
              className="w-full pl-10 p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Remarks"
              className="w-full p-3 rounded bg-#1e293b border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-400"
              rows={2}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-60"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle />}
          {submitting ? 'Submitting...' : 'Submit'}
        </motion.button>
      </motion.form>

      {/* Payment Table */}
      <div className="max-w-6xl mx-auto mt-10 overflow-x-auto bg-white/90 rounded-xl shadow-lg">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="animate-spin text-gray-600" size={48} />
          </div>
        ) : (
          <table className="w-full text-gray-900">
            <thead className="bg-slate-800 text-white text-left text-sm">
              <tr>
                <th className="p-3">Resident</th>
                <th className="p-3">Billing</th>
                <th className="p-3">Invoice</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? payments.map(pay => (
                <tr
                  key={pay._id}
                  className="border-b hover:bg-blue-100 transition"
                >
                  <td className="p-3">{pay.resident}</td>
                  <td className="p-3">{pay.billing}</td>
                  <td className="p-3">{pay.invoice || '-'}</td>
                  <td className="p-3 font-semibold">₹{pay.amountPaid}</td>
                  <td className="p-3 capitalize">{pay.paymentMethod}</td>
                  <td className="p-3">{pay.paymentDate ? new Date(pay.paymentDate).toLocaleString() : '-'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(pay._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-600">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPayment;
