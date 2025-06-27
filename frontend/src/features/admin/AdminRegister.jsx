/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaBriefcase,
  FaBuilding,
} from 'react-icons/fa';

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager',
    designation: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, designation, department } = form;

    if (!name || !email || !password || !designation || !department) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://hostel-management-fws2.onrender.com/api/admin/register',
        form
      );

      toast.success('✅ Admin registered successfully!', {
        duration: 1800,
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #3b82f6',
        },
        iconTheme: {
          primary: '#3b82f6',
          secondary: '#fff',
        },
      });

      setTimeout(() => {
        navigate('/admin-login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    {
      label: 'Name',
      name: 'name',
      icon: <FaUser />,
      type: 'text',
      placeholder: 'John Doe',
    },
    {
      label: 'Email',
      name: 'email',
      icon: <FaEnvelope />,
      type: 'email',
      placeholder: 'admin@example.com',
    },
    {
      label: 'Password',
      name: 'password',
      icon: <FaLock />,
      type: 'password',
      placeholder: '••••••••',
    },
    {
      label: 'Designation',
      name: 'designation',
      icon: <FaBriefcase />,
      type: 'text',
      placeholder: 'Project Lead',
    },
    {
      label: 'Department',
      name: 'department',
      icon: <FaBuilding />,
      type: 'text',
      placeholder: 'IT Department',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 sm:px-6 py-6">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl text-white border border-white/10 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {inputs.map(({ label, name, type, placeholder, icon }) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-1">
                {label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-white/70 text-xs">
                  {icon}
                </span>
                <input
                  id={name}
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out"
                />
              </div>
            </div>
          ))}

          <div>
            <label htmlFor="role" className="block mb-1">
              Role
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/70 text-xs">
                <FaUserShield />
              </span>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>

          <div className="text-center text-xs mt-4 text-gray-300">
            Already have an account?{' '}
            <Link to="/admin-login" className="text-blue-300 hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Fade-in animation (inject once or include in CSS file)
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
body {
  font-family: 'Inter', sans-serif;
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
