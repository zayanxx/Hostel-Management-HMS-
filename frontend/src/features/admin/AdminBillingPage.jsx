import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarDays, Loader2, Search } from 'lucide-react';

const AdminBillingPage = () => {
  const [bills, setBills] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = 'https://hostel-management-fws2.onrender.com/api/billing';

  // Fetch all bills
  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setBills(res.data);
      setFiltered(res.data);
      setError('');
    } catch (e) {
      console.error(e);
      setError('Failed to load billing records.');
    } finally {
      setLoading(false);
    }
  };

  // Filter by billing period
  const applyDateFilter = async () => {
    if (!dateRange.start || !dateRange.end) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/date-range?startDate=${dateRange.start}&endDate=${dateRange.end}`
      );
      setFiltered(res.data);
      setError('');
    } catch (e) {
      console.error(e);
      setError('Date filter failed.');
    } finally {
      setLoading(false);
    }
  };

  // Search by resident name or status
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(bills);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFiltered(
      bills.filter((b) => {
        const name = b.resident?.name?.toLowerCase() || '';
        const status = b.status?.toLowerCase() || '';
        return name.includes(term) || status.includes(term);
      })
    );
  }, [searchTerm, bills]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBills();
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-white">Billing Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resident or status…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
          className="border px-4 py-2 rounded-md shadow-sm"
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
          className="border px-4 py-2 rounded-md shadow-sm"
        />
        <button
          onClick={applyDateFilter}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <CalendarDays className="mr-2 h-5 w-5" /> Filter
        </button>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-6">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border rounded-md shadow-sm text-sm">
            <thead className="bg-gray-100 text-left font-semibold text-gray-700">
              <tr>
                <th className="p-3">Resident</th>
                <th className="p-3">Period</th>
                <th className="p-3">Room Fee</th>
                <th className="p-3">Utilities</th>
                <th className="p-3">Services</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Late Fee</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{b.resident?.name || b.resident}</td>
                    <td className="p-3">
                      {format(new Date(b.billingPeriodStart), 'MMM d')} –{' '}
                      {format(new Date(b.billingPeriodEnd), 'MMM d, yyyy')}
                    </td>
                    <td className="p-3">₹{b.roomFee.toFixed(2)}</td>
                    <td className="p-3">₹{b.utilitiesFee.toFixed(2)}</td>
                    <td className="p-3">₹{b.additionalServicesFee.toFixed(2)}</td>
                    <td className="p-3">-₹{b.discountAmount.toFixed(2)}</td>
                    <td className="p-3">₹{b.lateFee.toFixed(2)}</td>
                    <td className="p-3 font-semibold">₹{b.totalAmount.toFixed(2)}</td>
                    <td className="p-3 capitalize">{b.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">
                    No billing records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBillingPage;
