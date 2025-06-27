/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import {
    Loader2, Users, PlusCircle, Trash2
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const API = 'https://hostel-management-fws2.onrender.com/api/resident';

const initialForm = {
    user: '',
    room: '',
    contactNumber: '',
    emergencyContact: { name: '', phone: '' },
    checkInDate: '',
    checkOutDate: '',
    status: 'checked-in'
};

// Unified color palette
const COLORS = {
    primary: '#0ea5e9', // cyan-500
    primaryDark: '#0369a1', // cyan-700
    bgGradient: 'linear-gradient(135deg, #0f172a, #1e293b)',
    cardBg: 'rgba(15,23,42,0.97)', // slate-900, more opaque
    tableHeader: 'rgba(14,165,233,0.95)', // cyan-500
    hoverBg: 'rgba(14,165,233,0.08)', // cyan-500, light
    text: '#f1f5f9', // slate-100
    border: '#334155', // slate-700
    inputBg: '#1e293b', // slate-800
    inputText: '#f1f5f9', // slate-100
    danger: '#ef4444', // red-500
    dangerDark: '#b91c1c', // red-700
    success: '#22c55e', // green-500
    successDark: '#15803d', // green-700
};

const AdminResident = () => {
    const [residents, setResidents] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchResidents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API);
            setResidents(res.data.data || []);
        } catch {
            toast.error('Failed to fetch residents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('emergencyContact.')) {
            const key = name.split('.')[1];
            setForm((prev) => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [key]: value
                }
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (!form.user || !form.contactNumber) {
                toast.error('User ID and Contact Number are required');
                return;
            }
            await axios.post(API, form);
            toast.success('Resident created');
            setForm(initialForm);
            fetchResidents();
        } catch (err) {
            console.error(err);
            toast.error('Error creating resident');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resident?')) return;
        try {
            await axios.delete(`${API}/${id}`);
            toast.success('Resident deleted');
            fetchResidents();
        } catch {
            toast.error('Failed to delete resident');
        }
    };

    return (
        <div
            className="min-h-screen p-2 sm:p-4 md:p-8 flex flex-col items-center"
            style={{ background: COLORS.bgGradient }}
        >
            <ToastContainer position="top-right" theme="dark" />
            <motion.h1
                className="text-3xl font-bold mb-6 flex items-center gap-3 drop-shadow"
                style={{ color: COLORS.primary }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Users size={32} color={COLORS.primary} />
                Manage Residents
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl mx-auto p-2 sm:p-4 md:p-8 mb-6 rounded-xl shadow-lg"
                style={{
                    background: COLORS.cardBg,
                    color: COLORS.text,
                    border: `1px solid ${COLORS.border}`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.success }}>
                    <PlusCircle color={COLORS.success} /> Add Resident
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        name="user"
                        value={form.user}
                        onChange={handleChange}
                        placeholder="User ID"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                        required
                    />
                    <input
                        name="room"
                        value={form.room}
                        onChange={handleChange}
                        placeholder="Room ID (optional)"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                    />
                    <input
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                        required
                    />
                    <input
                        name="checkInDate"
                        value={form.checkInDate}
                        onChange={handleChange}
                        type="date"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                    />
                    <input
                        name="checkOutDate"
                        value={form.checkOutDate}
                        onChange={handleChange}
                        type="date"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                    />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                    >
                        <option value="checked-in" style={{ color: '#000' }}>Checked-In</option>
                        <option value="checked-out" style={{ color: '#000' }}>Checked-Out</option>
                    </select>
                    <input
                        name="emergencyContact.name"
                        value={form.emergencyContact.name}
                        onChange={handleChange}
                        placeholder="Emergency Contact Name"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                    />
                    <input
                        name="emergencyContact.phone"
                        value={form.emergencyContact.phone}
                        onChange={handleChange}
                        placeholder="Emergency Phone"
                        className="p-3 rounded bg-transparent border border-slate-700 focus:border-cyan-500 outline-none"
                        style={{ background: COLORS.inputBg, color: COLORS.inputText }}
                    />
                </div>
                <motion.button
                    type="submit"
                    className="mt-6 px-6 py-2 font-semibold rounded flex items-center gap-2 transition"
                    style={{
                        background: submitting ? COLORS.successDark : COLORS.success,
                        color: COLORS.text,
                        opacity: submitting ? 0.7 : 1,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={submitting}
                >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle />}
                    {submitting ? 'Submitting...' : 'Submit'}
                </motion.button>
            </motion.form>

            <div
                className="w-full max-w-6xl mx-auto overflow-x-auto"
                style={{
                    background: COLORS.cardBg,
                    borderRadius: 16,
                    boxShadow: '0 4px 24px 0 rgba(30,41,59,0.10)',
                    color: COLORS.text,
                    border: `1px solid ${COLORS.border}`,
                    marginBottom: '2rem',
                }}
            >
                {loading ? (
                    <div className="p-10 text-center">
                        <Loader2 className="animate-spin" size={48} color={COLORS.primary} />
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead style={{ background: COLORS.tableHeader, color: COLORS.text }}>
                            <tr>
                                <th className="p-3 text-left">User</th>
                                <th className="p-3 text-left">Room</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.length ? residents.map((res) => (
                                <tr
                                    key={res._id}
                                    className="border-b transition"
                                    style={{ borderColor: COLORS.border, cursor: 'pointer' }}
                                    onMouseOver={e => e.currentTarget.style.background = COLORS.hoverBg}
                                    onMouseOut={e => e.currentTarget.style.background = ''}
                                >
                                    <td className="p-3">
                                        {typeof res.user === 'object' && res.user !== null
                                            ? (res.user.name || res.user._id || JSON.stringify(res.user))
                                            : (res.user || '-')}
                                    </td>
                                    <td className="p-3">
                                        {typeof res.room === 'object' && res.room !== null
                                            ? (res.room.roomNumber || res.room._id || JSON.stringify(res.room))
                                            : (res.room || '-')}
                                    </td>
                                    <td className="p-3">{res.contactNumber}</td>
                                    <td className="p-3 capitalize">{res.status}</td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <button
                                            onClick={() => handleDelete(res._id)}
                                            className="rounded-full p-2 transition"
                                            style={{
                                                background: COLORS.danger,
                                                color: COLORS.text,
                                                border: 'none',
                                                outline: 'none',
                                            }}
                                            title="Delete"
                                            onMouseOver={e => e.currentTarget.style.background = COLORS.dangerDark}
                                            onMouseOut={e => e.currentTarget.style.background = COLORS.danger}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-400">No residents found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminResident;
