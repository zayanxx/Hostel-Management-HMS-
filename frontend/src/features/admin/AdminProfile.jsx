/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    UserCircle2,
    Mail,
    ShieldCheck,
    Building2,
    BadgeCheck,
    Phone,
    Calendar,
    MapPin,
    LogOut,
    Edit2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const labelClass = "font-semibold text-gray-200 min-w-[110px]";
const valueClass = "text-gray-300 break-all";

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://hostel-management-fws2.onrender.com/api/admin/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdmin(res.data.admin);
        } catch (err) {
            toast.error('Failed to load profile. Please log in again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-900 via-slate-800 to-white">
                <div className="animate-spin border-t-4 border-white border-solid rounded-full h-12 w-12"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-white flex items-center justify-center px-2 py-8">
            <motion.div
                className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-4 sm:p-8 md:p-12 max-w-3xl w-full text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border-b border-white/20 pb-6">
                    <div className="relative">
                        <UserCircle2 size={90} className="text-white drop-shadow-lg" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-1 break-words">{admin?.name}</h2>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-gray-300">
                            <Mail size={16} className="inline mr-1" />
                            <span className="break-all">{admin?.email}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-gray-300 mt-1">
                            <Phone size={16} className="inline mr-1" />
                            <span>{admin?.phone || 'Not provided'}</span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="mt-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ShieldCheck className="text-blue-400" />
                        <span className={labelClass}>Role:</span>
                        <span className={valueClass}>{admin?.role}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <BadgeCheck className="text-green-400" />
                        <span className={labelClass}>Designation:</span>
                        <span className={valueClass}>{admin?.designation || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Building2 className="text-yellow-400" />
                        <span className={labelClass}>Department:</span>
                        <span className={valueClass}>{admin?.department || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Calendar className="text-pink-400" />
                        <span className={labelClass}>Joined:</span>
                        <span className={valueClass}>
                            {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <MapPin className="text-orange-400" />
                        <span className={labelClass}>Address:</span>
                        <span className={valueClass}>{admin?.address || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <LogOut className="text-red-400" />
                        <span className={labelClass}>Status:</span>
                        <span className={valueClass}>{admin?.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    {/* Extra fields for more info */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className={labelClass}>Username:</span>
                        <span className={valueClass}>{admin?.username || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className={labelClass}>Gender:</span>
                        <span className={valueClass}>{admin?.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className={labelClass}>DOB:</span>
                        <span className={valueClass}>
                            {admin?.dob ? new Date(admin.dob).toLocaleDateString() : 'Not provided'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {/* Removed Edit Profile and Logout buttons as requested */}
            </motion.div>
        </div>
    );
};

export default AdminProfile;
