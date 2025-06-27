/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BedDouble,
  LayoutList,
  Building2,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const AdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: '',
    type: 'single',
    floor: '',
    capacity: '',
    status: 'available',
    pricePerMonth: '',
    features: '',
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://hostel-management-fws2.onrender.com/api/room');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      roomNumber: '',
      type: 'single',
      floor: '',
      capacity: '',
      status: 'available',
      pricePerMonth: '',
      features: '',
    });
    setEditingRoom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`https://hostel-management-fws2.onrender.com/api/room/${editingRoom._id}`, form);
        toast.success('Room updated successfully');
      } else {
        await axios.post('https://hostel-management-fws2.onrender.com/api/room', form);
        toast.success('Room created successfully');
      }
      fetchRooms();
      resetForm();
    } catch (err) {
      toast.error('Failed to save room');
      console.error(err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setForm(room);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`https://hostel-management-fws2.onrender.com/api/room/${id}`);
      toast.success('Room deleted');
      fetchRooms();
    } catch (err) {
      toast.error('Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.roomNumber.toString().includes(search) ||
      room.type.toLowerCase().includes(search.toLowerCase()) ||
      room.status.toLowerCase().includes(search.toLowerCase());
    const matchAvailability = showAvailableOnly ? room.status === 'available' : true;
    return matchSearch && matchAvailability;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Toaster position="top-right" />
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 mb-10 max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="Room Number" required className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="type" value={form.type} onChange={handleChange} className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['single', 'double', 'triple', 'suite', 'other'].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <input type="number" name="floor" value={form.floor} onChange={handleChange} placeholder="Floor" required className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" required className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="status" value={form.status} onChange={handleChange} className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['available', 'occupied', 'maintenance', 'reserved'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <input type="number" name="pricePerMonth" step="0.01" value={form.pricePerMonth} onChange={handleChange} placeholder="Price / Month" required className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="features" value={form.features} onChange={handleChange} placeholder="Features (comma separated)" className="md:col-span-2 p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={resetForm} className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition">Cancel</button>
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Search & Filter + Cards */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <LayoutList /> Manage Rooms
          </h2>
          <div className="flex gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search rooms..."
                className="pl-10 pr-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`px-4 py-2 rounded-xl border ${
                showAvailableOnly
                  ? 'bg-green-600 border-green-500 hover:bg-green-700'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              } transition`}
            >
              {showAvailableOnly ? 'Showing Available Only' : 'Show Available Rooms'}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading rooms...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.length ? (
              filteredRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-md space-y-2 hover:shadow-xl transition"
                >
                  <div className="text-xl font-semibold flex items-center gap-2">
                    <BedDouble size={20} /> Room {room.roomNumber}
                  </div>
                  <div className="text-sm flex items-center gap-2 text-gray-300">
                    <Building2 size={16} /> Floor {room.floor}
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2 text-gray-300">
                    <span className="flex items-center gap-1">
                      <Users size={16} /> {room.capacity} Capacity
                    </span>
                    <span className="capitalize">{room.type}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="flex items-center gap-1 text-green-400">
                      <DollarSign size={16} /> ₹{room.pricePerMonth} / month
                    </span>
                    <span className={`flex items-center gap-1 ${room.status === 'occupied' ? 'text-red-500' : 'text-green-500'}`}>
                      {room.status === 'occupied' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                      {room.status}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleEdit(room)} title="Edit" className="text-green-500 hover:text-green-600">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(room._id)} title="Delete" className="text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">No rooms found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoom;
