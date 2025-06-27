/* eslint-disable no-unused-vars */
// src/pages/ResidentPayment.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResidentPayment = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState([]);
  const [stage, setStage] = useState('select'); // select | checkout | success
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });

  useEffect(() => {
    axios.get('https://hostel-management-fws2.onrender.com/api/invoice/my-invoices')
      .then(res => setInvoices(res.data.filter(inv => inv.status === 'pending')))
      .catch(err => { if (err.response?.status === 401) navigate('/login'); });
  }, [navigate]);

  useEffect(() => {
    setErrors([]);
  }, [stage, selected, form]);

  const handleSelect = inv => {
    setSelected(inv);
    setStage('checkout');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePay = async e => {
    e.preventDefault();
    const errs = [];
    if (!form.cardNumber.match(/^\d{16}$/)) errs.push('Card number must be 16 digits');
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errs.push('Expiry must be MM/YY');
    if (!form.cvv.match(/^\d{3}$/)) errs.push('CVV must be 3 digits');
    if (errs.length) return setErrors(errs);

    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500)); // simulate processing
      await axios.put(`https://hostel-management-fws2.onrender.com/api/invoice/${selected._id}`, {
        status: 'paid', paymentDate: new Date(), notes: 'Paid via fake payment'
      });
      setStage('success');
    } catch {
      setErrors(['Payment failed. Try again later.']);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStage('select');
    setSelected(null);
    setForm({ cardNumber: '', expiry: '', cvv: '' });
    setInvoices(invoices.filter(inv => inv._id !== selected._id));
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Payments</h1>

        {stage === 'select' && (
          <>
            {invoices.length === 0 ? (
              <p className="text-gray-400 text-center">No pending invoices.</p>
            ) : (
              invoices.map(inv => (
                <motion.div
                  key={inv._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700 p-4 mb-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{inv.invoiceNumber}</p>
                    <p className="text-gray-300">₹{inv.amount.toFixed(2)}</p>
                    <p className="text-gray-400 text-xs">Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleSelect(inv)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Pay
                  </button>
                </motion.div>
              ))
            )}
          </>
        )}

        {stage === 'checkout' && selected && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePay}
            className="space-y-4"
          >
            <div className="bg-gray-700 p-4 rounded-lg flex items-center">
              <CreditCard className="text-gray-300 mr-3" />
              <div>
                <p className="text-white font-semibold">{selected.invoiceNumber}</p>
                <p className="text-gray-300">₹{selected.amount.toFixed(2)}</p>
              </div>
            </div>

            {errors.length > 0 && (
              <ul className="text-red-400 list-disc list-inside space-y-1">
                {errors.map((e,i) => <li key={i}>{e}</li>)}
              </ul>
            )}

            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="Card Number (16 digits)"
              className="w-full bg-gray-700 text-white rounded-md p-2"
            />
            <div className="flex gap-3">
              <input
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="flex-1 bg-gray-700 text-white rounded-md p-2"
              />
              <input
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="CVV"
                className="w-20 bg-gray-700 text-white rounded-md p-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? 'Processing…' : 'Pay Now'}
            </button>
          </motion.form>
        )}

        {stage === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle2 size={64} className="mx-auto text-green-400" />
            <p className="text-green-300 font-semibold">Payment Successful!</p>
            <button
              onClick={reset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Pay Another
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResidentPayment;