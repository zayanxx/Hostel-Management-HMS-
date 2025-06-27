/* eslint-disable no-unused-vars */
// src/pages/ResidentFoodOrder.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';

// Axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'other'];

const ResidentFoodOrder = () => {
  const navigate = useNavigate();
  const [resident, setResident] = useState(null);
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch profile and menu
  useEffect(() => {
    axios.get('https://hostel-management-fws2.onrender.com/api/auth/my-profile')
      .then(({ data }) => setResident(data))
      .catch(() => navigate('/login'));
    axios.get('https://hostel-management-fws2.onrender.com/api/food')
      .then(({ data }) => {
        setFoods(data);
        setFiltered(data);
      })
      .catch(() => setErrors(['Unable to load menu']));
  }, [navigate]);

  // Filter by category
  useEffect(() => {
    setFiltered(
      category === 'all'
        ? foods
        : foods.filter(f => f.category === category)
    );
  }, [category, foods]);

  const handleAddItem = (food) => {
    if (items.find(i => i._id === food._id)) return;
    setItems(prev => [...prev, { ...food, quantity: 1 }]);
  };

  const handleQtyChange = (idx, qty) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, qty) } : it));
  };

  const handleRemove = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const itemTotal = it => it.price * it.quantity;
  const totalAmount = items.reduce((sum, it) => sum + itemTotal(it), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');
    if (!items.length) return setErrors(['Please add at least one item']);

    try {
      setSubmitting(true);
      const payload = items.map(it => ({ food: it._id, quantity: it.quantity, unitPrice: it.price }));
      await axios.post('https://hostel-management-fws2.onrender.com/api/foodOrder', { items: payload });
      setSuccess('Order placed successfully! Redirecting...');
      setItems([]);
      setTimeout(() => navigate('/my-orders'), 1200);
    } catch (err) {
      const resp = err.response?.data;
      setErrors(resp?.errors ? resp.errors.map(e => e.msg) : [resp?.message || 'Submission failed']);
    } finally {
      setSubmitting(false);
    }
  };

  if (!resident) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <p className="text-gray-400 animate-pulse">Loading profile…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">
        {/* Header & Tabs */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Food Menu</h1>
          <p className="text-gray-400 mb-4">Welcome, {resident.name}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium 
                  ${category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}
                  hover:bg-indigo-500 transition`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {errors.length > 0 && (
          <div className="bg-red-800 text-red-200 p-4 rounded">
            <ul className="list-disc list-inside">
              {errors.map((e,i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}
        {success && (
          <div className="bg-green-800 text-green-200 p-4 rounded text-center">
            {success}
          </div>
        )}

        {/* Food Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        >
          {filtered.map(food => (
            <motion.div
              key={food._id}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow"
            >
              <img
                src={food.imageUrl || 'https://th.bing.com/th/id/OIP.k4OcXuhk55e2F_4Z4BvukQHaLH?rs=1&pid=ImgDetMain'}
                alt={food.name}
                className="h-32 w-full object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-40">
                <div>
                  <h3 className="text-lg font-semibold text-white truncate">{food.name}</h3>
                  <p className="text-gray-400">₹{food.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddItem(food)}
                  className="mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                >
                  <PlusCircle size={18}/> Add
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Order Summary */}
        {items.length > 0 && (
          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Your Order</h2>
            <div className="space-y-4">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-4 items-center">
                  <p className="col-span-2 text-white truncate">{it.name}</p>
                  <div className="col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={e => handleQtyChange(idx, Number(e.target.value))}
                      className="w-full bg-gray-700 text-white p-2 rounded text-center"
                    />
                  </div>
                  <p className="col-span-1 text-gray-300">₹{it.price.toFixed(2)}</p>
                  <p className="col-span-1 text-gray-300">₹{itemTotal(it).toFixed(2)}</p>
                  <button type="button" onClick={() => handleRemove(idx)} className="col-span-1 flex justify-center">
                    <Trash2 className="text-red-400 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-xl font-semibold text-white mb-4 md:mb-0">Total: ₹{totalAmount.toFixed(2)}</p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded text-white font-medium transition disabled:opacity-50"
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResidentFoodOrder;
