/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  UserCircle2,
  Home,
  MessageSquare,
  ShoppingCart,
  FileText,
  Wrench,
  CreditCard,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://hostel-management-fws2.onrender.com/api';
const ENDPOINTS = {
  profile: `${API_BASE}/auth/my-profile`,
  room: `${API_BASE}/room/myroom`,
  complaints: `${API_BASE}/complaint/my-complaints`,
  orders: `${API_BASE}/foodOrder/my-orders`,
  invoices: `${API_BASE}/invoice/my-invoices`,
  maintenance: `${API_BASE}/maintenance/my-requests`,
  payments: `${API_BASE}/payment/my-payments`
};

const SUMMARY_CARDS = [
  { key: 'complaints', label: 'Complaints', icon: MessageSquare, link: '/resident/complaints' },
  { key: 'orders',     label: 'Orders',     icon: ShoppingCart,  link: '/resident/food-orders' },
  { key: 'invoices',   label: 'Invoices',   icon: FileText,      link: '/resident/invoices' },
  { key: 'maintenance',label: 'Maintenance',icon: Wrench,        link: '/resident/maintenance' },
  { key: 'payments',   label: 'Payments',   icon: CreditCard,    link: '/resident/payments' }
];

const EMERGENCY_CONTACTS = [
  { name: "Campus Security",    phone: "+1 (555) 123-4567", description: "24/7 emergency response" },
  { name: "Medical Emergency",  phone: "+1 (555) 987-6543", description: "On-campus medical center" },
  { name: "Maintenance Hotline",phone: "+1 (555) 456-7890", description: "Urgent repairs" },
  { name: "Resident Advisor",   phone: "+1 (555) 234-5678", description: "After-hours assistance" }
];

const ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?crop=entropy&cs=tinysrgb&fit=max",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?crop=entropy&cs=tinysrgb&fit=max"
];

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [room, setRoom]       = useState(null);
  const [counts, setCounts]   = useState({});
  const [loading, setLoading] = useState(true);
  const [randomRoomImage, setRandomRoomImage] = useState("");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const getRandomImage = () =>
    ROOM_IMAGES[Math.floor(Math.random() * ROOM_IMAGES.length)];

  const fetchAllData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Not authenticated — redirecting...');
      return setTimeout(() => navigate('/login'), 1500);
    }
    setLoading(true);
    setRandomRoomImage(getRandomImage());

    try {
      const keys = Object.keys(ENDPOINTS);
      const calls = keys.map(key =>
        axios.get(ENDPOINTS[key], { headers: getAuthHeaders() })
      );
      const results = await Promise.allSettled(calls);

      if (results[0].status === 'fulfilled') setProfile(results[0].value.data);
      if (results[1].status === 'fulfilled') setRoom(results[1].value.data);

      const cnts = {};
      keys.slice(2).forEach((key, idx) => {
        const r = results[idx + 2];
        cnts[key] = r.status === 'fulfilled' && Array.isArray(r.value.data)
          ? r.value.data.length
          : 0;
      });
      setCounts(cnts);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired — please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to fetch dashboard data.');
        console.error('Dashboard error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Toaster position="top-right" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-400"></div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Toaster position="top-right" />
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg text-center max-w-md">
          <UserCircle2 size={48} className="text-red-500 mx-auto mb-4 animate-pulse"/>
          <h3 className="text-xl font-bold text-red-400 mb-2">Profile Load Failed</h3>
          <p className="text-gray-300 mb-6">Unable to load your profile.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => window.location.reload()} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Retry</button>
            <button onClick={() => navigate('/login')} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded">Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="p-2 bg-gray-800 rounded-lg">
            <LayoutDashboard size={30} className="text-yellow-400" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, <span className="text-yellow-400">{profile.user.name}</span>
            </h1>
            <p className="text-gray-400 text-sm">Your resident dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-full">
          <motion.div whileHover={{ rotate: 10 }} className="bg-yellow-400/10 p-2 rounded-full">
            <UserCircle2 size={22} className="text-yellow-400"/>
          </motion.div>
          <div className="text-right hidden sm:block">
            <p className="font-medium">{profile.user.email}</p>
            <p className="text-xs text-gray-400">ID: {profile.user._id.slice(0,8)}…</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
        {SUMMARY_CARDS.map(({ key, icon: Icon, label, link }) => (
          <motion.button key={key} whileHover={{ y: -5, scale: 1.03 }} onClick={() => navigate(link)}
            className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center transition"
          >
            <Icon className="text-yellow-400 mb-2" size={22}/>
            <span className="text-xl font-bold">{counts[key]||0}</span>
            <span className="text-xs text-gray-400 mt-1">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Main Grid: Profile & Room */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Profile */}
        <motion.div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <UserCircle2 size={20} className="text-yellow-400 mr-2"/>
            <h2 className="text-yellow-400 text-xl font-semibold">My Profile</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="font-semibold text-gray-300 w-24">Name:</span>
              <span>{profile.user.name}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-300 w-24">Email:</span>
              <span>{profile.user.email}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-300 w-24">Role:</span>
              <span className="capitalize">{profile.user.role}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-300 w-24">User ID:</span>
              <motion.code className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded font-mono text-xs break-all"
                initial={{ scale: 1 }} animate={{ scale: [1,1.05,1] }} transition={{ repeat: Infinity, duration:2 }}
              >
                {profile.user._id}
              </motion.code>
            </div>
          </div>
        </motion.div>

        {/* Room */}
        <motion.div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <Home size={20} className="text-yellow-400 mr-2"/>
            <h2 className="text-yellow-400 text-xl font-semibold">My Room</h2>
          </div>
          {room?.roomNumber ? (
            <div className="flex flex-col flex-grow">
              {randomRoomImage && (
                <div className="mb-4 rounded-xl overflow-hidden h-40">
                  <img src={randomRoomImage} alt="Room" className="w-full h-full object-cover"/>
                </div>
              )}
              {['Room #','Room ID','Type','Floor','Rent','Status'].map((label,i)=>(
                <div key={i} className="flex items-start">
                  <span className="font-semibold text-gray-300 w-24">{label}:</span>
                  {label==='Room ID' ? (
                    <motion.code className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded font-mono text-xs break-all"
                      initial={{ scale:1 }} animate={{ scale:[1,1.05,1] }} transition={{ repeat:Infinity, duration:2 }}
                    >
                      {room._id}
                    </motion.code>
                  ) : (
                    <span>
                      {label==='Rent'
                        ? `₹${Number(room.pricePerMonth).toLocaleString()}/mo`
                        : (label==='Room #' ? room.roomNumber : room[label.toLowerCase()])}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow py-8">
              <Home size={40} className="text-gray-500 mb-3"/>
              <p className="text-gray-400 mb-4">No room assigned</p>
              <button onClick={()=>navigate('/resident/room-assignment')}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg"
              >
                Request Assignment
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer: Emergency Contacts */}
      <motion.footer className="bg-gray-800 border-t border-gray-700 rounded-t-2xl shadow-inner p-6"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <AlertTriangle size={20} className="text-red-400 mr-2"/>
          <h2 className="text-red-400 text-xl font-semibold">Emergency Contacts</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Important numbers for urgent assistance. Save them in your phone.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((c,i)=>(
            <motion.div key={i} whileHover={{ translateX:5 }} className="bg-gray-700 p-4 rounded-xl border border-gray-600">
              <div className="flex items-start">
                <Phone size={18} className="text-red-400 mr-3"/>
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{c.description}</p>
                  <a href={`tel:${c.phone.replace(/[^0-9+]/g,'')}`}
                    className="text-red-400 hover:text-red-300 mt-2 inline-block"
                  >
                    {c.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-6">
          <span className="font-semibold">Note:</span> In critical emergencies, always dial local emergency services first.
        </p>
      </motion.footer>
    </div>
  );
}
