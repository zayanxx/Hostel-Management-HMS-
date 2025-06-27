import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaPhoneAlt,
    FaUserFriends,
    FaBuilding,
    FaRegClock,
    FaDoorOpen,
    FaSpinner
} from 'react-icons/fa';

const API_BASE = 'https://hostel-management-fws2.onrender.com';

const InputField = React.memo(({
    id,
    label,
    icon: Icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required,
    ...props
}) => (
    <div className="space-y-1 w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-200">
            {label}
        </label>
        <div className="relative flex items-center">
            {Icon && (
                <span className="absolute left-3 flex items-center h-full pointer-events-none">
                    <Icon className="text-blue-400 text-lg" />
                </span>
            )}
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                autoComplete="off"
                required={required}
                {...props}
                className={`w-full pl-11 pr-3 py-2 text-sm bg-white/90 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border transition
                    ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
                    dark:bg-white/20 dark:text-white dark:placeholder-gray-300 dark:border-white/30`}
            />
        </div>
        {error && <p id={`${id}-error`} role="alert" className="text-red-500 text-xs">{error}</p>}
    </div>
));

const SelectField = React.memo(({
    id,
    label,
    icon: Icon,
    value,
    onChange,
    options,
    error,
    placeholder,
    required
}) => (
    <div className="space-y-1 w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-200">
            {label}
        </label>
        <div className="relative flex items-center">
            {Icon && (
                <span className="absolute left-3 flex items-center h-full pointer-events-none">
                    <Icon className="text-blue-400 text-lg" />
                </span>
            )}
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                required={required}
                className={`w-full pl-11 pr-3 py-2 bg-white/90 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border transition
                    ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
                    dark:bg-white/20 dark:text-white dark:border-white/30`}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
        {error && <p id={`${id}-error`} role="alert" className="text-red-500 text-xs">{error}</p>}
    </div>
));

export default function Register() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'resident',
        room: '', contactNumber: '', emergencyName: '', emergencyPhone: '',
        department: '', shift: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isSubmitting = useRef(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/api/room`);
                setRooms(data.rooms || data);
            } catch (err) {
                console.error('Error fetching rooms:', err);
            }
        };
        fetchRooms();
    }, []);

    const handleChange = useCallback(e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    }, []);

    const clientValidate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
        if (form.password.length < 6) errs.password = 'Minimum 6 characters';
        if (!form.contactNumber.trim()) errs.contactNumber = 'Contact number required';
        if (form.role === 'resident') {
            if (!form.room) errs.room = 'Room selection is required';
            if (!form.emergencyName.trim()) errs.emergencyName = 'Emergency contact name required';
            if (!form.emergencyPhone.trim()) errs.emergencyPhone = 'Emergency contact phone required';
        }
        if (form.role === 'staff') {
            if (!form.department) errs.department = 'Department is required';
            if (!form.shift) errs.shift = 'Shift is required';
        }
        return errs;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const clientErrs = clientValidate();
        if (Object.keys(clientErrs).length) {
            setErrors(clientErrs);
            const firstKey = Object.keys(clientErrs)[0];
            document.getElementById(firstKey)?.focus();
            return;
        }
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            room: form.role === 'resident' ? form.room : undefined,
            contactNumber: form.contactNumber,
            emergencyContact: form.role === 'resident' ? { name: form.emergencyName, phone: form.emergencyPhone } : undefined,
            department: form.role === 'staff' ? form.department : undefined,
            shift: form.role === 'staff' ? form.shift : undefined,
        };

        try {
            setLoading(true);
            await axios.post(`${API_BASE}/api/auth/register`, payload);
            toast.success('Registration successful! Redirecting...', { style: { background: '#1e293b', color: '#fff' } });
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const resp = err.response?.data;
            if (resp?.errors && Array.isArray(resp.errors)) {
                const fieldErrors = {};
                resp.errors.forEach(e => { fieldErrors[e.param] = e.msg });
                setErrors(fieldErrors);
            } else {
                toast.error(resp?.message || 'Registration failed');
            }
        } finally {
            isSubmitting.current = false;
            setLoading(false);
        }
    };

    return (
        <main role="main" className="min-h-screen flex items-center justify-center px-2 py-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
            <Toaster position="bottom-right" />
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-8 space-y-6 shadow-lg text-white animate-fade-in"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Create Account</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField id="name" label="Name" icon={FaUser} value={form.name} onChange={handleChange} placeholder="John Doe" error={errors.name} required />
                    <InputField id="email" label="Email" type="email" icon={FaEnvelope} value={form.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
                    <InputField id="password" label="Password" type="password" icon={FaLock} value={form.password} onChange={handleChange} placeholder="••••••••" error={errors.password} required />
                    <InputField id="contactNumber" label="Contact Number" icon={FaPhoneAlt} value={form.contactNumber} onChange={handleChange} placeholder="+91 98765 43210" error={errors.contactNumber} required />
                </div>
                <SelectField id="role" label="Role" icon={FaUserFriends} value={form.role} onChange={handleChange} placeholder="Select Role" required options={[{ value: 'resident', label: 'Resident' }, { value: 'staff', label: 'Staff' }]} />

                {form.role === 'resident' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectField id="room" label="Room" icon={FaDoorOpen} value={form.room} onChange={handleChange} placeholder="Select Room" error={errors.room} required options={rooms.map(r => ({ value: r._id, label: r.name || r.number || `Room ${r._id.slice(-4)}` }))} />
                        <InputField id="emergencyName" label="Emergency Contact Name" icon={FaUserFriends} value={form.emergencyName} onChange={handleChange} placeholder="Jane Doe" error={errors.emergencyName} required />
                        <InputField id="emergencyPhone" label="Emergency Contact Phone" icon={FaPhoneAlt} value={form.emergencyPhone} onChange={handleChange} placeholder="+91 91234 56789" error={errors.emergencyPhone} required />
                    </div>
                )}

                {form.role === 'staff' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField id="department" label="Department" icon={FaBuilding} value={form.department} onChange={handleChange} placeholder="Select Department" error={errors.department} required options={[{ value: 'HR', label: 'HR' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'reception', label: 'Reception' }, { value: 'security', label: 'Security' }, { value: 'cleaning', label: 'Cleaning' }]} />
                        <SelectField id="shift" label="Shift" icon={FaRegClock} value={form.shift} onChange={handleChange} placeholder="Select Shift" error={errors.shift} required options={[{ value: 'morning', label: 'Morning' }, { value: 'evening', label: 'Evening' }, { value: 'night', label: 'Night' }, { value: 'rotational', label: 'Rotational' }]} />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 mt-4 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="text-center text-xs text-gray-300 mt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-300 hover:underline">Login here</Link>
                </p>
            </form>
        </main>
    );
}

// Global style for animation and placeholder color
if (typeof document !== 'undefined' && !document.getElementById('register-styles')) {
    const tag = document.createElement('style');
    tag.id = 'register-styles';
    tag.innerHTML = `
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        input::placeholder, select::placeholder { color: #64748b !important; opacity: 1; }
        @media (max-width: 640px) {
            form { padding: 1rem !important; }
            .grid { grid-template-columns: 1fr !important; }
        }
    `;
    document.head.appendChild(tag);
}
