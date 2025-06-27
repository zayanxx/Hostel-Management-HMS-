/* eslint-disable no-unused-vars */
// src/pages/ResidentInvoice.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const statuses = ['all', 'pending', 'paid', 'overdue', 'cancelled'];

const ResidentInvoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch resident invoices
  useEffect(() => {
    axios
      .get('https://hostel-management-fws2.onrender.com/api/invoice/my-invoices')
      .then(({ data }) => {
        setInvoices(data);
        setFiltered(data);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login');
        else setError('Failed to load invoices');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Apply status filter
  useEffect(() => {
    if (statusFilter === 'all') setFiltered(invoices);
    else
      setFiltered(
        invoices.filter((inv) => inv.status === statusFilter)
      );
  }, [statusFilter, invoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-gray-400 animate-pulse">Loading invoices…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
            My Invoices
          </h1>
          <div className="flex flex-wrap items-center space-x-2">
            <Filter className="text-gray-400" />
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition
                  ${statusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-indigo-500'}
                `}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-800 text-red-200 p-4 rounded">
            {error}
          </div>
        )}

        {/* Invoice Grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center">No invoices found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.map((inv) => (
              <motion.div
                key={inv._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-between"
              >
                {/* Invoice Info */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {inv.invoiceNumber}
                  </h2>
                  <p className="text-gray-300">
                    Amount: ₹{inv.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-400">
                    Issued: {new Date(inv.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400">
                    Due: {new Date(inv.dueDate).toLocaleDateString()}
                  </p>
                  {inv.paymentDate && (
                    <p className="text-green-300">
                      Paid: {new Date(inv.paymentDate).toLocaleDateString()}
                    </p>
                  )}
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium
                      ${
                        inv.status === 'paid'
                          ? 'bg-green-600 text-white'
                          : inv.status === 'overdue'
                          ? 'bg-red-600 text-white'
                          : inv.status === 'cancelled'
                          ? 'bg-gray-600 text-gray-200'
                          : 'bg-yellow-600 text-gray-900'
                      }
                    `}
                  >
                    {inv.status.toUpperCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => navigate(`/invoices/${inv._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                  >
                    <Eye size={16} /> View
                  </button>
                  <a
                    href={`https://hostel-management-fws2.onrender.com/api/invoice/${inv._id}/download`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-lg transition"
                  >
                    <Download size={16} /> Download
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResidentInvoice;