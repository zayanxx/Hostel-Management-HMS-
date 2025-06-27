/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import {
    PlusCircle, Trash2, Edit2, AlertCircle, Loader2
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const statusColors = {
    submitted: 'bg-blue-100 text-blue-700',
    assigned: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
};

const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
};

const AdminMaintenance = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        room: '',
        issueTitle: '',
        issueDescription: '',
        priority: 'medium',
        status: 'submitted',
    });

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://hostel-management-fws2.onrender.com/api/maintenance');
            setRequests(res.data);
        } catch {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const resetForm = () => {
        setForm({ room: '', issueTitle: '', issueDescription: '', priority: 'medium', status: 'submitted' });
        setEditing(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`https://hostel-management-fws2.onrender.com/api/maintenance/${editing._id}`, form);
                toast.success('Updated maintenance request');
            } else {
                await axios.post('https://hostel-management-fws2.onrender.com/api/maintenance', form);
                toast.success('Created maintenance request');
            }
            resetForm();
            fetchAll();
        } catch {
            toast.error('Failed to save request');
        }
    };

    const handleEdit = (req) => {
        setEditing(req);
        setForm({
            room: req.room,
            issueTitle: req.issueTitle,
            issueDescription: req.issueDescription,
            priority: req.priority,
            status: req.status,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this request?')) return;
        try {
            await axios.delete(`https://hostel-management-fws2.onrender.com/api/maintenance/${id}`);
            toast.success('Deleted request');
            fetchAll();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-2 md:px-8">
            <ToastContainer position="top-right" theme="colored" />

            <motion.h1
                className="text-white text-2xl md:text-4xl font-bold mb-8 flex items-center gap-3 drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <AlertCircle size={36} className="text-yellow-400" /> Maintenance Requests
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl mx-auto p-6 mb-10 space-y-5 bg-white/10 border-2 border-white rounded-2xl backdrop-blur-lg shadow-2xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="room"
                        value={form.room}
                        onChange={handleChange}
                        required
                        placeholder="Room ID"
                        className="bg-slate-100/70 border border-slate-300 focus:bg-blue-50 focus:border-blue-400 text-slate-800 rounded-lg px-4 py-3 outline-none transition-all placeholder-gray-500 w-full"
                    />
                    <input
                        name="issueTitle"
                        value={form.issueTitle}
                        onChange={handleChange}
                        required
                        placeholder="Issue Title"
                        className="bg-slate-100/70 border border-slate-300 focus:bg-blue-50 focus:border-blue-400 text-slate-800 rounded-lg px-4 py-3 outline-none transition-all placeholder-gray-500 w-full"
                    />
                </div>

                <textarea
                    name="issueDescription"
                    value={form.issueDescription}
                    onChange={handleChange}
                    required
                    placeholder="Describe the issue..."
                    rows={3}
                    className="bg-slate-100/70 border border-slate-300 focus:bg-blue-50 focus:border-blue-400 text-slate-800 rounded-lg px-4 py-3 outline-none transition-all placeholder-gray-500 w-full"
                />

                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="bg-slate-100/70 border border-slate-300 focus:bg-blue-50 focus:border-blue-400 text-slate-800 rounded-lg px-4 py-3 outline-none transition-all w-full"
                    >
                        {['low', 'medium', 'high', 'urgent'].map(p => (
                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                    </select>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="bg-slate-100/70 border border-slate-300 focus:bg-blue-50 focus:border-blue-400 text-slate-800 rounded-lg px-4 py-3 outline-none transition-all w-full"
                    >
                        {['submitted', 'assigned', 'in_progress', 'completed', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white px-6 py-2 font-semibold flex items-center gap-2 shadow-md transition-all"
                    >
                        <PlusCircle /> {editing ? 'Update Request' : 'Create Request'}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg px-6 py-2 font-semibold shadow transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </motion.form>

            <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-x-auto shadow-2xl bg-white/10 border-2 border-white backdrop-blur-lg">
                {loading ? (
                    <div className="p-10 text-center"><Loader2 className="animate-spin text-gray-600 mx-auto" size={48} /></div>
                ) : (
                    <table className="w-full text-slate-900 text-sm md:text-base">
                        <thead className="bg-slate-900/90 text-white">
                            <tr>
                                <th className="p-3 font-semibold text-left">Room</th>
                                <th className="p-3 font-semibold text-left">Issue</th>
                                <th className="p-3 font-semibold text-left">Priority</th>
                                <th className="p-3 font-semibold text-left">Status</th>
                                <th className="p-3 font-semibold text-left">Submitted At</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map(req => (
                                    <motion.tr
                                        key={req._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-b border-white/30 hover:bg-blue-100/30 transition-all"
                                    >
                                        <td className="p-3 font-medium">{req.room}</td>
                                        <td className="p-3">{req.issueTitle}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[req.priority] || 'bg-gray-100 text-gray-700'}`}>
                                                {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {req.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </td>
                                        <td className="p-3">{new Date(req.submittedAt).toLocaleString()}</td>
                                        <td className="p-3 flex flex-wrap justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(req)}
                                                className="p-2 rounded hover:bg-green-100 transition"
                                                title="Edit"
                                            >
                                                <Edit2 className="text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(req._id)}
                                                className="p-2 rounded hover:bg-red-100 transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="text-red-600" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminMaintenance;
