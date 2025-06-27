import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://hostel-management-fws2.onrender.com/api/admin/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      toast.success('✅ Login successful!', {
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
        navigate('/admin');
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <Toaster position="bottom-right" />

      <div className="w-full max-w-sm sm:max-w-md bg-white/10 backdrop-blur-md text-white p-6 sm:p-8 rounded-xl shadow-xl border border-white/10 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-5">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5 text-sm">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/70 text-xs">
                <FaEnvelope />
              </span>
              <input
                type="email"
                id="email"
                required
                autoFocus
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/70 text-xs">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 rounded-md bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-300 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out text-white font-semibold shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center text-xs mt-3">
            Don’t have an account?{' '}
            <Link to="/admin-register" className="text-blue-300 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
