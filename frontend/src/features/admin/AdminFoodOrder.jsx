/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FaTrash, FaEdit
} from 'react-icons/fa';

const API_URL = 'https://hostel-management-fws2.onrender.com/api/food-orders';

const AdminFoodOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '', paymentStatus: '' });
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL, { params: filters });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch food orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food order?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}/${editingOrder._id}`, editingOrder);
      toast.success('Order updated');
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  const handleChange = (e) => {
    setEditingOrder({ ...editingOrder, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen px-2 py-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">📦 Admin Food Orders</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 items-center justify-between bg-slate-800 bg-opacity-60 p-4 rounded-lg shadow">
          <input
            className="flex-1 min-w-[160px] px-3 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Filter by resident ID"
            onChange={(e) => setFilters({ ...filters, resident: e.target.value })}
          />
          <select
            className="flex-1 min-w-[140px] px-3 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="flex-1 min-w-[140px] px-3 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          >
            <option value="">All Payment Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white bg-opacity-5 shadow">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-800 text-slate-300">
              <tr>
                <th className="p-3">Resident</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Ordered</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                  <td className="p-3 break-all">{order.resident}</td>
                  <td className="p-3">
                    {order.items.map((i) => (
                      <div key={i.food} className="text-xs">
                        {i.quantity} × ₹{i.unitPrice}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-semibold text-green-300">₹{order.totalAmount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${order.status === 'pending' && 'bg-yellow-600/80'}
                      ${order.status === 'confirmed' && 'bg-blue-600/80'}
                      ${order.status === 'delivered' && 'bg-green-600/80'}
                      ${order.status === 'cancelled' && 'bg-red-600/80'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${order.paymentStatus === 'unpaid' && 'bg-yellow-700/80'}
                      ${order.paymentStatus === 'paid' && 'bg-green-700/80'}
                      ${order.paymentStatus === 'failed' && 'bg-red-700/80'}
                    `}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">{new Date(order.orderedAt).toLocaleString()}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="inline-flex items-center justify-center p-2 rounded hover:bg-blue-900 transition"
                      aria-label="Edit"
                    >
                      <FaEdit className="text-blue-400 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="inline-flex items-center justify-center p-2 rounded hover:bg-red-900 transition"
                      aria-label="Delete"
                    >
                      <FaTrash className="text-red-400 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center p-6 text-gray-400">No orders found.</div>
          )}
        </div>

        {/* Edit Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <motion.div
              className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-md text-white mx-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center">Edit Order</h2>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  value={editingOrder.status}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={editingOrder.paymentStatus}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminFoodOrder;
