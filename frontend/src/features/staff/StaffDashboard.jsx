/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  UserCircle,
  Briefcase,
  Phone,
  AlertTriangle,
  ClipboardList,
  FileText,
  Calendar,
  Users,
  HelpCircle,
  Clock,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = 'https://hostel-management-fws2.onrender.com/api/staff/me';

const EMERGENCY_CONTACTS = [
  {
    name: "Security Office",
    phone: "+91 98765 43210",
    description: "24/7 campus security assistance"
  },
  {
    name: "Medical Helpdesk",
    phone: "+91 91234 56789",
    description: "Immediate medical emergencies"
  },
  {
    name: "Admin Office",
    phone: "+91 99876 54321",
    description: "For account and profile issues"
  },
];

export default function StaffDashboard() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStaffProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStaff(res.data);
    } catch (err) {
      toast.error('Failed to load staff profile.');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStaffProfile();
  }, [fetchStaffProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <Toaster />
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-yellow-400 mx-auto mb-4" />
          <p className="animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <Toaster />
        <div className="text-center">
          <UserCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Staff Profile Not Found</h2>
          <p className="text-gray-400 mt-2">Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-8">
      <Toaster />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
            <UserCircle className="mr-2" size={20} />
            My Profile
          </h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Name:</span> {staff.name}</p>
            <p><span className="text-gray-400">Email:</span> {staff.email}</p>
            <p><span className="text-gray-400">Contact:</span> {staff.contact}</p>
            <p><span className="text-gray-400">User ID:</span> {staff.user?._id}</p>
          </div>
        </motion.div>

        {/* Work Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
            <Briefcase className="mr-2" size={20} />
            Work Information
          </h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Department:</span> {staff.department}</p>
            <p><span className="text-gray-400">Shift:</span> {staff.shift}</p>
            <p><span className="text-gray-400">Joined:</span> {new Date(staff.joinedDate).toLocaleDateString()}</p>
            <p><span className="text-gray-400">Status:</span>
              <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                staff.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {staff.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg col-span-1 md:col-span-2 xl:col-span-3"
        >
          <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Emergency Contacts
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 text-sm">
            {EMERGENCY_CONTACTS.map((contact, index) => (
              <div key={index} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-gray-400">{contact.description}</p>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-red-400 hover:text-red-300 block mt-1"
                >
                  <Phone size={14} className="inline-block mr-1" />
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Resources and Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Staff Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
            <ClipboardList className="mr-2" size={20} />
            Staff Resources
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition text-left">
              <div className="flex items-center mb-2">
                <FileText className="text-blue-400 mr-2" size={18} />
                <span>Policies</span>
              </div>
              <p className="text-gray-400 text-sm">Staff handbook and guidelines</p>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition text-left">
              <div className="flex items-center mb-2">
                <Calendar className="text-green-400 mr-2" size={18} />
                <span>Calendar</span>
              </div>
              <p className="text-gray-400 text-sm">Important dates and events</p>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition text-left">
              <div className="flex items-center mb-2">
                <Users className="text-purple-400 mr-2" size={18} />
                <span>Directory</span>
              </div>
              <p className="text-gray-400 text-sm">Staff and department contacts</p>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition text-left">
              <div className="flex items-center mb-2">
                <HelpCircle className="text-amber-400 mr-2" size={18} />
                <span>Support</span>
              </div>
              <p className="text-gray-400 text-sm">Get help with systems</p>
            </button>
          </div>
        </motion.div>

        {/* Upcoming Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Upcoming Schedule
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Morning Shift</h3>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                  Today
                </span>
              </div>
              <p className="text-gray-400 mt-1">8:00 AM - 4:00 PM</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Department Meeting</h3>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  Tomorrow
                </span>
              </div>
              <p className="text-gray-400 mt-1">10:00 AM - 11:30 AM</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Training Session</h3>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                  Friday
                </span>
              </div>
              <p className="text-gray-400 mt-1">1:00 PM - 3:00 PM</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 px-4 sm:px-6 md:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Shield className="text-amber-400" size={20} />
            <span className="font-medium">Staff Portal v2.0</span>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Campus Management System. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
