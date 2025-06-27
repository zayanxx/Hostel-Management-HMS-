/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// API Endpoints
const PROFILE_API           = 'https://hostel-management-fws2.onrender.com/api/staff/me';
const CREATE_ATTENDANCE_API = 'https://hostel-management-fws2.onrender.com/api/attendance';
const MY_ATTENDANCE_API     = 'https://hostel-management-fws2.onrender.com/api/attendance/staff';

export default function StaffAttendance() {
  const [profile, setProfile]         = useState(null);
  const [records, setRecords]         = useState([]);
  const [todayRec, setTodayRec]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token');
      const { data } = await axios.get(PROFILE_API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      return data;
    } catch (err) {
      toast.error('Session expired. Redirecting...');
      setTimeout(() => (window.location.href = '/login'), 1500);
      return null;
    }
  }, []);

  const fetchAttendance = useCallback(async (staffId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${MY_ATTENDANCE_API}/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(data);
      const key = new Date().setHours(0,0,0,0);
      const today = data.find(r=>new Date(r.date).setHours(0,0,0,0)===key);
      setTodayRec(today||null);
    } catch (err) {
      toast.error('Could not load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async()=>{
      const user = await fetchProfile();
      if(user?._id) await fetchAttendance(user._id);
    })();
  }, [fetchProfile, fetchAttendance]);

  const handleCheckIn = async () => {
    if(!profile) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        CREATE_ATTENDANCE_API,
        { staff: profile._id, status: 'present', staffName: profile.name, staffEmail: profile.email, staffRole: profile.department },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Checked in');
      fetchAttendance(profile._id);
    } catch (err) {
      toast.error(err.response?.data?.message||'Check-in failed');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(records.length / perPage);
  const paginated = records.slice((currentPage-1)*perPage, currentPage*perPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <Toaster />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">My Attendance</h1>
          {!todayRec && (
            <button
              onClick={handleCheckIn}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg text-lg font-medium transition"
            >
              <CheckCircle size={20} /> Check In
            </button>
          )}
        </div>

        {/* Today Card */}
        {todayRec && (
          <div className="bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
            <Clock size={32} className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Checked in today at</p>
              <p className="text-xl font-semibold">
                {new Date(todayRec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Time In</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {loading ? (
                <tr><td colSpan={3} className="py-6 text-center">Loading…</td></tr>
              ) : paginated.length ? (
                paginated.map(rec => (
                  <tr key={rec._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(rec.checkInTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {rec.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="py-6 text-center text-gray-500">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-800 rounded disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-800 rounded disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}