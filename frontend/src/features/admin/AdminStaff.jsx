/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import {
    Loader2,
    Users,
    PlusCircle,
    Trash2,
    User,
    Mail,
    Phone,
    Briefcase,
    Clock
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

// Unified color palette
const COLORS = {
    primary: '#0ea5e9',
    primaryDark: '#0369a1',
    bgGradient: 'linear-gradient(135deg, #0f172a, #1e293b)',
    cardBg: 'rgba(15,23,42,0.97)',
    tableHeader: 'rgba(14,165,233,0.95)',
    hoverBg: 'rgba(14,165,233,0.08)',
    text: '#f1f5f9',
    border: '#334155',
    inputBg: '#1e293b',
    inputText: '#f1f5f9',
    danger: '#ef4444',
    dangerDark: '#b91c1c',
    success: '#22c55e',
    successDark: '#15803d'
};

const initialForm = {
    userId: '',
    name: '',
    email: '',
    contact: '',
    department: 'other',
    shift: 'rotational'
};

const AdminStaff = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://hostel-management-fws2.onrender.com/api/staff');
            setStaffList(data.staff || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (!form.userId || !form.name || !form.email || !form.contact) {
                setError('Please fill all required fields');
            } else {
                await axios.post('https://hostel-management-fws2.onrender.com/api/staff', form);
                toast.success('Staff created!');
                resetForm();
                fetchStaff();
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this staff member?')) return;
        try {
            await axios.delete(`https://hostel-management-fws2.onrender.com/api/staff/${id}`);
            toast.success('Deleted');
            fetchStaff();
        } catch {
            toast.error('Delete failed');
        }
    };

    // Responsive styles
    const responsiveFormGrid = {
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '100%',
    };

    const responsiveTableWrapper = {
        overflowX: 'auto',
        width: '100%',
        margin: '0 auto',
    };

    // Media query for mobile
    const mediaQuery = `
        @media (max-width: 700px) {
            .admin-staff-form-grid {
                grid-template-columns: 1fr !important;
            }
            .admin-staff-table th, .admin-staff-table td {
                font-size: 0.95rem !important;
                padding: 0.5rem !important;
            }
            .admin-staff-table {
                font-size: 0.97rem !important;
            }
        }
    `;

    return (
        <div
            style={{
                minHeight: '100vh',
                background: COLORS.bgGradient,
                padding: '2rem 0.5rem',
                color: COLORS.text,
                boxSizing: 'border-box'
            }}
        >
            <style>{mediaQuery}</style>
            <ToastContainer position="top-right" />

            <motion.h1
                className="flex items-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    justifyContent: 'center'
                }}
            >
                <Users size={32} color={COLORS.primary} />
                <span style={{ fontSize: '1.75rem', marginLeft: '0.5rem', fontWeight: 600 }}>Staff Management</span>
            </motion.h1>

            {error && (
                <div style={{ color: COLORS.danger, marginBottom: '1rem', textAlign: 'center' }}>{error}</div>
            )}

            {/* Form Card */}
            <motion.div
                style={{
                    background: COLORS.cardBg,
                    borderRadius: '8px',
                    padding: '1.5rem',
                    maxWidth: '800px',
                    margin: '0 auto 2rem auto',
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                    <PlusCircle color={COLORS.success} style={{ marginRight: 8 }} /> Add New Staff
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="admin-staff-form-grid"
                    style={responsiveFormGrid}
                    autoComplete="off"
                >
                    <div style={{ position: 'relative' }}>
                        <User
                            size={18}
                            color={COLORS.inputText}
                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            placeholder="User ID"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.inputBg,
                                color: COLORS.inputText,
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <User
                            size={18}
                            color={COLORS.inputText}
                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.inputBg,
                                color: COLORS.inputText,
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail
                            size={18}
                            color={COLORS.inputText}
                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.inputBg,
                                color: COLORS.inputText,
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Phone
                            size={18}
                            color={COLORS.inputText}
                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            name="contact"
                            value={form.contact}
                            onChange={handleChange}
                            placeholder="Contact Number"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.inputBg,
                                color: COLORS.inputText,
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Briefcase
                            size={18}
                            color={COLORS.inputText}
                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.inputBg,
                                color: COLORS.inputText,
                                outline: 'none'
                            }}
                        >
                            {['HR','maintenance','reception','security','cleaning','other'].map(dep => (
                                <option key={dep} value={dep}>
                                    {dep.charAt(0).toUpperCase() + dep.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Clock
                            size={18}
                            color={COLORS.inputText}
                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <select
                            name="shift"
                            value={form.shift}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.inputBg,
                                color: COLORS.inputText,
                                outline: 'none'
                            }}
                        >
                            {['morning','evening','night','rotational'].map(shift => (
                                <option key={shift} value={shift}>
                                    {shift.charAt(0).toUpperCase() + shift.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ gridColumn: 'span 2', textAlign: 'right', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                marginRight: '1rem',
                                padding: '0.6rem 1.2rem',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.dangerDark}`,
                                background: COLORS.danger,
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: 6,
                                border: 'none',
                                background: COLORS.primary,
                                color: '#fff',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontWeight: 500,
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}
                        >
                            {submitting ? (
                                <Loader2 className="animate-spin" size={16} color="#fff" />
                            ) : (
                                <PlusCircle size={16} color="#fff" />
                            )}
                            <span style={{ marginLeft: '0.5rem' }}>
                                {submitting ? 'Submitting...' : 'Create Staff'}
                            </span>
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Staff Table */}
            <motion.div
                style={{
                    background: COLORS.cardBg,
                    borderRadius: 12,
                    padding: '1rem',
                    maxWidth: '1100px',
                    margin: '0 auto',
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div style={responsiveTableWrapper}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Loader2 className="animate-spin" size={48} color={COLORS.primary} />
                        </div>
                    ) : (
                        <table
                            className="admin-staff-table"
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                color: COLORS.text,
                                minWidth: 600,
                                fontSize: '1.05rem'
                            }}
                        >
                            <thead style={{ background: COLORS.tableHeader }}>
                                <tr>
                                    {['Name','Email','Contact','Department','Shift','Actions'].map(col => (
                                        <th
                                            key={col}
                                            style={{
                                                padding: '0.75rem',
                                                border: `1px solid ${COLORS.border}`,
                                                textAlign: 'left',
                                                fontWeight: 600
                                            }}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map(s => (
                                    <tr
                                        key={s._id}
                                        onMouseEnter={e => (e.currentTarget.style.background = COLORS.hoverBg)}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        style={{ border: `1px solid ${COLORS.border}`, transition: 'background 0.2s' }}
                                    >
                                        <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>{s.name}</td>
                                        <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>{s.email}</td>
                                        <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>{s.contact}</td>
                                        <td style={{ padding: '0.75rem', verticalAlign: 'middle', textTransform: 'capitalize' }}>{s.department}</td>
                                        <td style={{ padding: '0.75rem', verticalAlign: 'middle', textTransform: 'capitalize' }}>{s.shift}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                style={{
                                                    color: COLORS.danger,
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 4,
                                                    borderRadius: 4,
                                                    transition: 'background 0.15s'
                                                }}
                                                title="Delete"
                                                tabIndex={0}
                                            >
                                                <Trash2 size={18} color={COLORS.danger} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {staffList.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#aaa' }}>
                                            No staff members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminStaff;
