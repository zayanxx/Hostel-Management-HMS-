/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Home, DollarSign, CalendarCheck, MessageSquare,
  ShoppingCart, FileText, Wrench, CreditCard, Lightbulb, LogOut,
  Menu, X
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/resident', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resident/room', icon: Home, label: 'My Room' },
  { to: '/resident/complaints', icon: MessageSquare, label: 'Complaints' },
  { to: '/resident/food-orders', icon: ShoppingCart, label: 'Food Orders' },
  { to: '/resident/invoices', icon: FileText, label: 'Invoices' },
  { to: '/resident/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/resident/payments', icon: CreditCard, label: 'Payments' },
];

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition text-base ${
          isActive
            ? 'bg-yellow-400 text-gray-900 shadow'
            : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-300'
        }`
      }
      onClick={onClick}
      end
    >
      <Icon size={20} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function ResidentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed?.name || 'Resident');
      } catch {
        setUserName('Resident');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-800 p-4 space-y-2 fixed inset-y-0 left-0 z-30 border-r border-gray-700">
        <h2 className="text-2xl font-extrabold text-yellow-400 mb-6 tracking-tight text-center whitespace-nowrap">Resident Panel</h2>
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {NAV_LINKS.map(link => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Tablet Sidebar */}
      <aside className="hidden md:flex lg:hidden flex-col w-20 bg-gray-800 p-2 fixed inset-y-0 left-0 z-30 border-r border-gray-700">
        <h2 className="text-xl font-extrabold text-yellow-400 mb-4 text-center">RP</h2>
        <nav className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-12 h-12 rounded-md transition font-medium text-xs ${
                  isActive
                    ? 'bg-yellow-400 text-gray-900 shadow'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-300'
                }`
              }
              end
            >
              <link.icon size={22} />
              <span className="truncate">{link.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 flex flex-col items-center gap-1 px-2 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded transition"
        >
          <LogOut size={20} />
          <span className="text-xs">Logout</span>
        </button>
      </aside>

      {/* Sticky Topbar for Mobile */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-gray-800 flex justify-between items-center px-4 py-3 shadow">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md bg-gray-800 border border-gray-700 text-yellow-400"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-yellow-300">{userName}</h1>
        <div className="w-10" />
      </header>

      {/* Framer Motion Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 z-50 h-full w-[90vw] max-w-xs bg-gray-800 p-4 flex flex-col shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-yellow-400 truncate">{userName}</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded hover:bg-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {NAV_LINKS.map(link => (
                  <NavItem key={link.to} {...link} onClick={() => setMobileOpen(false)} />
                ))}
              </nav>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="mt-6 flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded transition"
              >
                <LogOut size={20} /> Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-200 pt-20 md:pt-8 lg:pt-0 ${'lg:ml-64 md:ml-20'}`}
      >
        <div className="max-w-5xl mx-auto w-full min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] px-3 sm:px-5 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
