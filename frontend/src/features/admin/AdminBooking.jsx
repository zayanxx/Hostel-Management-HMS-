import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-blue-100 text-blue-700',
};

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    room: ''
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.room) params.room = filters.room;

      const res = await axios.get('https://hostel-management-fws2.onrender.com/api/bookings', { params });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch bookings');
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <span role="img" aria-label="bed">🛏️</span>
          <span>Manage Bookings</span>
        </h1>
        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl px-3 py-2 md:px-4 md:py-3 w-full md:w-auto"
        >
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">Payment</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="text"
            name="room"
            placeholder="Room ID"
            value={filters.room}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto"
          >
            <FaSearch /> <span className="hidden sm:inline">Filter</span>
          </button>

          <button
            type="button"
            onClick={fetchBookings}
            className="flex items-center justify-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition w-full sm:w-auto"
          >
            <FaSyncAlt /> <span className="hidden sm:inline">Refresh</span>
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-500 text-lg">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">#</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Room</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Resident</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Check-In</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Check-Out</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Payment</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b._id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">{i + 1}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">{b.room}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">{b.resident}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">{new Date(b.checkInDate).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[b.status] || statusColors.pending}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[b.paymentStatus] || paymentColors.pending}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-t">{new Date(b.createdAt).toLocaleDateString()}</td>
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

export default AdminBooking;
