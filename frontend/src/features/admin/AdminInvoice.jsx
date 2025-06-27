import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaPlusCircle,
    FaTrashAlt,
    FaEdit,
    FaFileInvoice,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [form, setForm] = useState({
        invoiceNumber: '',
        resident: '',
        billing: '',
        dueDate: '',
        amount: '',
        status: 'pending',
        paymentDate: '',
        notes: '',
    });
    const [editingId, setEditingId] = useState(null);

    const fetchInvoices = async () => {
        try {
            const res = await axios.get('https://hostel-management-fws2.onrender.com/api/invoice');
            setInvoices(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Error fetching invoices');
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`https://hostel-management-fws2.onrender.com/api/invoice/${editingId}`, form);
                toast.success('Invoice updated!');
            } else {
                await axios.post('https://hostel-management-fws2.onrender.com/api/invoice', form);
                toast.success('Invoice created!');
            }
            setForm({
                invoiceNumber: '',
                resident: '',
                billing: '',
                dueDate: '',
                amount: '',
                status: 'pending',
                paymentDate: '',
                notes: '',
            });
            setEditingId(null);
            fetchInvoices();
        } catch (err) {
            console.error(err);
            toast.error('Error submitting invoice');
        }
    };

    const handleEdit = invoice => {
        setForm({ ...invoice, dueDate: invoice.dueDate?.split('T')[0] });
        setEditingId(invoice._id);
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this invoice?')) return;
        try {
            await axios.delete(`https://hostel-management-fws2.onrender.com/api/invoice/${id}`);
            toast.success('Invoice deleted!');
            fetchInvoices();
        } catch {
            toast.error('Failed to delete invoice');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 text-slate-100 p-2 md:p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                    <FaFileInvoice className="text-blue-400" /> Manage Invoices
                </h1>

                {/* Invoice Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-10 rounded-2xl shadow-xl bg-white/10 border border-slate-600 backdrop-blur-md px-4 py-6 md:px-8 md:py-8"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="invoiceNumber"
                            value={form.invoiceNumber}
                            onChange={handleChange}
                            placeholder="Invoice Number"
                            required
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        <input
                            type="text"
                            name="resident"
                            value={form.resident}
                            onChange={handleChange}
                            placeholder="Resident ID"
                            required
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        <input
                            type="text"
                            name="billing"
                            value={form.billing}
                            onChange={handleChange}
                            placeholder="Billing ID"
                            required
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            required
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Amount"
                            required
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                            type="date"
                            name="paymentDate"
                            value={form.paymentDate}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        <input
                            type="text"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Notes"
                            className="p-3 rounded-lg bg-white/20 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-blue-400 outline-none transition col-span-1 sm:col-span-2 lg:col-span-3"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-lg flex items-center gap-2 justify-center font-semibold shadow-md"
                    >
                        <FaPlusCircle />
                        {editingId ? 'Update Invoice' : 'Create Invoice'}
                    </button>
                </form>

                {/* Invoice Table */}
                <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/10 border border-slate-600 backdrop-blur-md">
                    <table className="w-full text-sm md:text-base text-left">
                        <thead className="bg-slate-900/90">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Invoice #</th>
                                <th className="px-4 py-3 font-semibold">Resident</th>
                                <th className="px-4 py-3 font-semibold">Billing</th>
                                <th className="px-4 py-3 font-semibold">Amount</th>
                                <th className="px-4 py-3 font-semibold">Due Date</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice, idx) => (
                                <tr
                                    key={invoice._id}
                                    className={`transition ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/5'} hover:bg-blue-500/10`}
                                >
                                    <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                                    <td className="px-4 py-2">{invoice.resident}</td>
                                    <td className="px-4 py-2">{invoice.billing}</td>
                                    <td className="px-4 py-2 font-semibold text-blue-300">₹{invoice.amount}</td>
                                    <td className="px-4 py-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 capitalize">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${
                                                invoice.status === 'paid'
                                                    ? 'bg-green-600/80 text-green-100'
                                                    : invoice.status === 'pending'
                                                    ? 'bg-yellow-600/80 text-yellow-100'
                                                    : invoice.status === 'overdue'
                                                    ? 'bg-red-600/80 text-red-100'
                                                    : 'bg-gray-600/80 text-gray-100'
                                            }`}
                                        >
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(invoice)}
                                            className="p-2 rounded hover:bg-yellow-400/20 transition"
                                            title="Edit"
                                        >
                                            <FaEdit className="text-yellow-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(invoice._id)}
                                            className="p-2 rounded hover:bg-red-500/20 transition"
                                            title="Delete"
                                        >
                                            <FaTrashAlt className="text-red-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!invoices.length && (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-300">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInvoice;
