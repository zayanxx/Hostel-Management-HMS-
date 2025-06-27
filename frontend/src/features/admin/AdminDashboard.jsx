/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Users, Home, DoorOpen, FileText, DollarSign, MessageSquare, LogOut, UserCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  primary: '#0ea5e9',
  bg: 'linear-gradient(135deg, #0f172a, #1e293b)',
  cardBg: 'rgba(15,23,42,0.97)',
  text: '#f1f5f9'
};

const CARDS = [
  { label: 'Residents', icon: Users, endpoint: '/api/resident' },
  { label: 'Rooms', icon: DoorOpen, endpoint: '/api/room' },
  { label: 'Staff', icon: Home, endpoint: '/api/staff' },
  { label: 'Billings', icon: FileText, endpoint: '/api/billing' },
  { label: 'Payments', icon: DollarSign, endpoint: '/api/payment' },
  { label: 'Suggestions', icon: MessageSquare, endpoint: '/api/suggestion' }
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, labels: { color: COLORS.text } },
    title: {
      display: true,
      text: 'Overview by Category',
      color: COLORS.text,
      font: { size: 16 }
    }
  },
  scales: {
    x: { grid: { color: '#334155' }, ticks: { color: COLORS.text }, maxRotation: 0, minRotation: 0 },
    y: { grid: { color: '#334155' }, ticks: { color: COLORS.text }, beginAtZero: true }
  }
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = await Promise.all(
          CARDS.map(c => axios.get(`https://hostel-management-fws2.onrender.com${c.endpoint}`))
        );
        const newCounts = {};
        CARDS.forEach((c, i) => {
          const data = results[i].data;
          newCounts[c.label] = Array.isArray(data) ? data.length : data.count || 0;
        });
        setCounts(newCounts);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://hostel-management-fws2.onrender.com/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(res.data.admin);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };

    fetchCounts();
    fetchAdminProfile();
  }, []);

  const chartData = {
    labels: CARDS.map(c => c.label),
    datasets: [{
      label: 'Count',
      data: CARDS.map(c => counts[c.label] || 0),
      backgroundColor: COLORS.primary,
      borderRadius: 6
    }]
  };

  const occupancyData = {
    labels: ['Occupied', 'Vacant'],
    datasets: [{
      label: 'Rooms',
      data: [
        counts.Residents || 0,
        Math.max(0, (counts.Rooms || 0) - (counts.Residents || 0))
      ],
      backgroundColor: ['#10b981', '#f59e0b'],
      borderRadius: 6
    }]
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out');
    setTimeout(() => window.location.href = '/login', 800);
  };

  return (
    <div
      className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6"
      style={{ background: COLORS.bg, color: COLORS.text }}
    >
      <ToastContainer position="top-right" />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Profile */}
        <div className="relative self-end sm:self-auto">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Toggle profile menu"
          >
            <UserCircle2 size={28} />
            <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
              {admin?.name || 'Admin'}
            </span>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-1 w-64 max-w-[90vw] bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-4 z-40"
              >
                <div className="flex flex-col items-center gap-2">
                  <UserCircle2 size={56} className="text-white" />
                  <p className="font-semibold text-white text-base truncate text-center">
                    {admin?.name}
                  </p>
                  <p className="text-sm text-slate-400 truncate text-center">
                    {admin?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm flex justify-center items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {CARDS.map(({ label, icon: Icon }) => (
          <motion.div
            key={label}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg shadow hover:shadow-lg transition"
            style={{ background: COLORS.cardBg }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Icon size={24} color={COLORS.primary} />
            <p className="text-lg sm:text-xl font-bold truncate mt-1">
              {counts[label] || 0}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 truncate">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-6 mb-8">
        <div className="bg-slate-900 rounded-lg p-4 shadow h-64 sm:h-72">
          {!loading && <Bar data={chartData} options={chartOptions} />}
        </div>
        <div className="bg-slate-900 rounded-lg p-4 shadow h-64 sm:h-72">
          {!loading && (
            <Bar
              data={occupancyData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Room Occupancy Breakdown',
                    color: COLORS.text,
                    font: { size: 16 }
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Suggestions & Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <section className="bg-slate-900 rounded-lg p-4 shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Recent Suggestions</h3>
          <ul className="space-y-1 text-slate-300 text-sm">
            {['Add vending machines', 'Fix corridor lights', 'Monthly cultural event'].map(s => (
              <li key={s} className="flex items-start">
                <span className="text-sky-400 mr-2">•</span>
                <span className="truncate">{s}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-slate-900 rounded-lg p-4 shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">System Announcements</h3>
          <ul className="space-y-1 text-slate-300 text-sm">
            {['Wi-Fi upgrade on June 20', 'Water cutoff 2–4PM', 'New maintenance staff'].map(a => (
              <li key={a} className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span className="truncate">{a}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Hostel Management System
      </footer>
    </div>
  );
};

export default AdminDashboard;