/* eslint-disable no-unused-vars */
// src/features/resident/ResidentMaintenance.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Wrench, ChevronDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const statuses = [
    'all',
    'submitted',
    'assigned',
    'in_progress',
    'completed',
    'cancelled'
];

const statusStyles = {
    submitted: 'bg-yellow-600 text-gray-900',
    assigned: 'bg-blue-600 text-white',
    in_progress: 'bg-indigo-600 text-white',
    completed: 'bg-green-600 text-white',
    cancelled: 'bg-red-600 text-white',
};

const ResidentMaintenance = () => {
    const navigate = useNavigate();
    const [resident, setResident] = useState(null);
    const [requests, setRequests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [form, setForm] = useState({
        room: '',
        issueTitle: '',
        issueDescription: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Axios interceptor for auth
    axios.interceptors.request.use((cfg) => {
        const token = localStorage.getItem('token');
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
        return cfg;
    });

    // Fetch resident profile & their maintenance requests
    useEffect(() => {
        Promise.all([
            axios.get('https://hostel-management-fws2.onrender.com/api/auth/my-profile'),
            axios.get('https://hostel-management-fws2.onrender.com/api/maintenance/my-requests'),
        ])
            .then(([profileRes, reqRes]) => {
                setResident(profileRes.data);
                setRequests(reqRes.data);
                setFiltered(reqRes.data);
            })
            .catch((err) => {
                if (err.response?.status === 401) navigate('/login');
                else {
                    setErrors(['Failed to load data']);
                    toast.error('Failed to load data');
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    // Filter requests by status
    useEffect(() => {
        if (statusFilter === 'all') setFiltered(requests);
        else setFiltered(requests.filter(r => r.status === statusFilter));
    }, [statusFilter, requests]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const errs = [];
        if (!form.room) errs.push('Room ID is required');
        if (!form.issueTitle) errs.push('Issue title is required');
        if (!form.issueDescription) errs.push('Issue description is required');
        if (errs.length) {
            setErrors(errs);
            errs.forEach(msg => toast.error(msg));
            return;
        }

        try {
            setSubmitting(true);
            const res = await axios.post(
                'https://hostel-management-fws2.onrender.com/api/maintenance',
                form
            );
            setRequests(r => [res.data, ...r]);
            setForm({ room: '', issueTitle: '', issueDescription: '', priority: 'medium' });
            toast.success('Request submitted successfully!');
        } catch (err) {
            const resp = err.response?.data;
            if (resp?.errors) {
                setErrors(resp.errors.map(e => e.msg));
                resp.errors.forEach(e => toast.error(e.msg));
            } else {
                setErrors([resp?.message || 'Submission failed']);
                toast.error(resp?.message || 'Submission failed');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-gray-400 animate-pulse">Loading…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 px-2 py-6 sm:px-4 md:px-8">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Maintenance Requests
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Hello, {resident?.name}
                    </p>
                </div>

                {/* New Request Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg space-y-4"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                        <Wrench /> Submit New Request
                    </h2>

                    {errors.length > 0 && (
                        <ul className="text-red-400 list-disc list-inside space-y-1">
                            {errors.map((e,i) => <li key={i}>{e}</li>)}
                        </ul>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm">Room ID</label>
                            <input
                                name="room"
                                value={form.room}
                                onChange={handleChange}
                                className="mt-1 w-full bg-gray-700 text-white rounded-md p-2"
                                placeholder="Enter Room ID"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm">Priority</label>
                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                className="mt-1 w-full bg-gray-700 text-white rounded-md p-2"
                            >
                                {['low','medium','high','urgent'].map(p => (
                                    <option key={p} value={p}>
                                        {p.charAt(0).toUpperCase()+p.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm">Title</label>
                        <input
                            name="issueTitle"
                            value={form.issueTitle}
                            onChange={handleChange}
                            className="mt-1 w-full bg-gray-700 text-white rounded-md p-2"
                            placeholder="Short summary"
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm">Description</label>
                        <textarea
                            name="issueDescription"
                            value={form.issueDescription}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 w-full bg-gray-700 text-white rounded-md p-2"
                            placeholder="Describe the issue"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition disabled:opacity-50 flex justify-center"
                    >
                        {submitting ? 'Submitting…' : 'Submit Request'}
                    </button>
                </motion.form>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2">
                    {statuses.map(st => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition
                                ${statusFilter === st
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-indigo-500'}
                            `}
                        >
                            {st === 'all' ? 'All' : st.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>

                {/* Requests Grid */}
                {filtered.length === 0 ? (
                    <p className="text-gray-400 text-center mt-8">
                        No maintenance requests found.
                    </p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {filtered.map(req => (
                            <motion.div
                                key={req._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-800 p-4 sm:p-5 rounded-xl shadow flex flex-col justify-between min-h-[180px]"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                                        {req.issueTitle}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {req.issueDescription.length > 80
                                            ? req.issueDescription.slice(0, 80) + '…'
                                            : req.issueDescription}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Room: {req.room}
                                    </p>
                                </div>
                                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusStyles[req.status] || 'bg-gray-700 text-white'}`}
                                    >
                                        {req.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <p className="text-gray-400 text-xs flex items-center gap-1">
                                        <Clock size={14} /> {new Date(req.submittedAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/maintenance/${req._id}`)}
                                        className="text-indigo-400 hover:text-indigo-300 ml-auto"
                                        aria-label="View Details"
                                    >
                                        <ChevronDown size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResidentMaintenance;
