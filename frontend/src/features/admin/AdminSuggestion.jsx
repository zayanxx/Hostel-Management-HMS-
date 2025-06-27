/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import {
    Loader2,
    MessageSquare,
    CheckCircle,
    XCircle,
    Trash2,
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const API = 'https://hostel-management-fws2.onrender.com/api/suggestion';

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'implemented', label: 'Implemented' },
    { value: 'rejected', label: 'Rejected' },
];

const AdminSuggestion = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch suggestions (admins only)
    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(API);
            setSuggestions(data);
        } catch {
            toast.error('Failed to load suggestions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Update a suggestion's status
    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`${API}/${id}`, { status: newStatus });
            toast.success('Status updated');
            setSuggestions((prev) =>
                prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
            );
        } catch {
            toast.error('Failed to update status');
        }
    };

    // Delete a suggestion
    const deleteSuggestion = async (id) => {
        if (!window.confirm('Delete this suggestion?')) return;
        try {
            await axios.delete(`${API}/${id}`);
            toast.success('Deleted');
            setSuggestions((prev) => prev.filter((s) => s._id !== id));
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
            <ToastContainer position="top-right" />
            <motion.h1
                className="text-white text-2xl md:text-4xl font-bold mb-6 flex items-center gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <MessageSquare size={32} className="text-cyan-400" /> Suggestion Board
            </motion.h1>

            <div className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-gray-600" size={48} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-gray-900 text-sm md:text-base">
                            <thead>
                                <tr className="bg-slate-800 text-white">
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Subject</th>
                                    <th className="p-3 text-left">Content</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Created At</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suggestions.length ? suggestions.map((s) => (
                                    <tr
                                        key={s._id}
                                        className="border-b last:border-b-0 hover:bg-blue-50 transition"
                                    >
                                        <td className="p-3 align-top">{s.name}</td>
                                        <td className="p-3 align-top">{s.subject || '-'}</td>
                                        <td className="p-3 align-top max-w-xs md:max-w-md truncate">
                                            <span title={s.content}>{s.content}</span>
                                        </td>
                                        <td className="p-3 align-top">
                                            <select
                                                value={s.status}
                                                onChange={(e) => updateStatus(s._id, e.target.value)}
                                                className="p-2 rounded bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-400"
                                            >
                                                {statusOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3 align-top whitespace-nowrap">
                                            {new Date(s.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => updateStatus(s._id, 'implemented')}
                                                    title="Mark Implemented"
                                                    className="p-1 rounded hover:bg-green-100"
                                                >
                                                    <CheckCircle className="text-green-600 hover:text-green-800" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(s._id, 'rejected')}
                                                    title="Mark Rejected"
                                                    className="p-1 rounded hover:bg-red-100"
                                                >
                                                    <XCircle className="text-red-600 hover:text-red-800" />
                                                </button>
                                                <button
                                                    onClick={() => deleteSuggestion(s._id)}
                                                    title="Delete"
                                                    className="p-1 rounded hover:bg-gray-200"
                                                >
                                                    <Trash2 className="text-gray-600 hover:text-gray-800" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            No suggestions yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSuggestion;
