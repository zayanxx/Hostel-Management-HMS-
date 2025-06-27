import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Loader2, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ResidentBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required.');
      return setLoading(false);
    }

    try {
      const res = await axios.get('https://hostel-management-fws2.onrender.com/api/booking/my-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <Toaster position="top-right" />
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-10 w-10 text-yellow-400 mb-3" />
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck size={28} className="text-yellow-400" />
          <h2 className="text-2xl font-semibold">My Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center text-red-400 mt-10">
            <AlertCircle className="mx-auto mb-2" size={36} />
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
            <table className="w-full text-sm bg-gray-800 text-gray-300">
              <thead className="bg-gray-700 text-left text-yellow-400">
                <tr>
                  <th className="px-4 py-3">Room #</th>
                  <th className="px-4 py-3">Check-In</th>
                  <th className="px-4 py-3">Check-Out</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                    <td className="px-4 py-2">{b.room?.roomNumber || '—'}</td>
                    <td className="px-4 py-2">
                      {new Date(b.checkInDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(b.checkOutDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          b.status === 'confirmed'
                            ? 'bg-green-600 text-white'
                            : b.status === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          b.paymentStatus === 'paid'
                            ? 'bg-green-600 text-white'
                            : b.paymentStatus === 'failed'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentBooking;