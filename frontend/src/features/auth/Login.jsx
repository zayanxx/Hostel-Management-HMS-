import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const API_URL = 'https://hostel-management-fws2.onrender.com/api/auth/login';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email and password are required!');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(API_URL, { email, password });
      const { token, user } = response.data;

      if (!token) throw new Error('No token returned');

      localStorage.setItem('token', token); // ✅ Correct key

      toast.success('Login successful', {
        icon: '✅',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #3b82f6',
        },
      });

      // Redirect based on role
      setTimeout(() => {
        if (user?.role === 'resident') navigate('/resident');
        else if (user?.role === 'staff') navigate('/staff');
        else navigate('/user/home');
      }, 1200);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg, {
        style: { background: '#7f1d1d', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-md p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-white mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-white font-medium">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-300" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-white/20 text-white border border-white/30 rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm text-white font-medium">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-300" />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 pl-10 pr-10 bg-white/20 text-white border border-white/30 rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPwd ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold flex justify-center items-center gap-2 transition"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
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
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
