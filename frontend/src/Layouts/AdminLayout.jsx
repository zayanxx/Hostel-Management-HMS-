/* eslint-disable no-unused-vars */
// AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faHome,
  faUsers,
  faDoorOpen,
  faUser,
  faFileAlt,
  faDollarSign,
  faCommentDots,
  faChartBar,
  faBars,
  faTimes,
  faUtensils,
  faClipboardList,
  faFileInvoice,
  faTools,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: faHome },
  { to: 'resident', label: 'Residents', icon: faUsers },
  { to: 'room', label: 'Rooms', icon: faDoorOpen },
  { to: 'staff', label: 'Staff', icon: faUser },
  { to: 'billing', label: 'Billing', icon: faFileAlt },
  { to: 'payment', label: 'Payments', icon: faDollarSign },
  { to: 'suggestion', label: 'Suggestions', icon: faCommentDots },
  { to: 'attendance', label: 'Attendance', icon: faChartBar },
  { to: 'booking', label: 'Booking', icon: faClipboardList },
  { to: 'complaint', label: 'Complaints', icon: faCommentDots },
  { to: 'food', label: 'Food', icon: faUtensils },
  { to: 'food-order', label: 'Food Orders', icon: faClipboardList },
  { to: 'invoice', label: 'Invoices', icon: faFileInvoice },
  { to: 'maintenance', label: 'Maintenance', icon: faTools },
];

const sidebarVariants = {
  open: { width: 240, transition: { type: 'spring', stiffness: 200, damping: 24 } },
  collapsed: { width: 64, transition: { type: 'spring', stiffness: 200, damping: 24 } },
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sidebar for desktop */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'open'}
        className="hidden lg:flex flex-col h-full bg-slate-900 border-r border-slate-800 shadow-lg z-30"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faChartBar} size="lg" className="text-indigo-400" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-bold text-indigo-200"
                >
                  Admin
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-slate-800 transition"
            aria-label="Toggle Sidebar"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            >
              <FontAwesomeIcon icon={faBars} className="text-indigo-300" />
            </motion.div>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-indigo-100 hover:bg-slate-800 transition-all duration-200 ${
                  isActive ? 'bg-indigo-900/60 text-indigo-300 font-semibold' : ''
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex-shrink-0"
              >
                <FontAwesomeIcon icon={icon} size="sm" />
              </motion.div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 shadow-lg flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} size="lg" className="text-indigo-400" />
                <span className="text-xl font-bold text-indigo-200">Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded hover:bg-slate-800 transition"
                aria-label="Close Sidebar"
              >
                <FontAwesomeIcon icon={faTimes} className="text-indigo-300" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-auto">
              {navItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-indigo-100 hover:bg-slate-800 transition-all duration-200 ${
                      isActive ? 'bg-indigo-900/60 text-indigo-300 font-semibold' : ''
                    }`
                  }
                >
                  <FontAwesomeIcon icon={icon} size="sm" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar / header */}
        <header className="flex items-center justify-between bg-slate-800/90 px-4 py-3 border-b border-slate-700 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded hover:bg-slate-700 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Sidebar"
            >
              <FontAwesomeIcon icon={faBars} className="text-indigo-300" />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-indigo-100">Admin Panel</h2>
          </div>
          {/* User menu / logout can go here */}
        </header>

        {/* Outlet for child routes */}
        <main className="flex-1 overflow-auto p-3 md:p-6 bg-gradient-to-br from-slate-800 to-slate-900">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
