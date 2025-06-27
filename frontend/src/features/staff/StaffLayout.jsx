/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  UserCircle,
  CalendarDays,
  Briefcase,
} from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function StaffLayout() {
  const [staff, setStaff] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const res = await axios.get('https://hostel-management-fws2.onrender.com/api/staff/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(res.data);
      } catch (err) {
        toast.error('Session expired');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/staff' },
    { name: 'Attendance', icon: CalendarDays, path: '/staff/attendance' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
      <Toaster />

      {/* Sidebar */}
      <aside className="md:w-64 w-full md:h-auto h-auto bg-gray-800 p-5 flex flex-col justify-between md:fixed md:top-0 md:left-0 md:bottom-0 z-50">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">Staff Panel</h2>
          <p className="text-sm text-gray-400 mb-6">Welcome back</p>

          <nav className="space-y-2">
            {menuItems.map(({ name, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  location.pathname === path
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition mt-6"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 overflow-y-auto">
        {staff && (
          <header className="mb-6 border-b border-gray-700 pb-4">
            <h1 className="text-2xl font-bold text-yellow-400">Hello, {staff.name}</h1>
            <p className="text-sm text-gray-400">{staff.email}</p>
          </header>
        )}

        <Outlet />
      </main>
    </div>
  );
}
