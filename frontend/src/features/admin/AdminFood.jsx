/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Trash2, Pencil, Loader2, X } from 'lucide-react';
import { FaUtensils } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://hostel-management-fws2.onrender.com/api/food';

const categories = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'other', label: 'Other' },
];

const BG_COLOR = "bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen";

const inputBase =
    "input input-bordered w-full bg-white/20 border-slate-500 text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 transition-all text-base placeholder:text-slate-400";

const AdminFood = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'other',
        price: '',
        isAvailable: true,
    });

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setFoods(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch food items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price) {
            toast.error('Name and price are required');
            return;
        }
        try {
            if (editingFood) {
                await axios.put(`${API_URL}/${editingFood._id}`, form);
                toast.success('Food updated successfully');
            } else {
                await axios.post(API_URL, form);
                toast.success('Food created successfully');
            }
            setForm({ name: '', description: '', category: 'other', price: '', isAvailable: true });
            setEditingFood(null);
            fetchFoods();
        } catch (err) {
            console.error(err);
            toast.error('Error saving food');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this food item?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            toast.success('Food deleted');
            fetchFoods();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete food');
        }
    };

    const handleEdit = (food) => {
        setEditingFood(food);
        setForm({
            name: food.name,
            description: food.description,
            category: food.category,
            price: food.price,
            isAvailable: food.isAvailable,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingFood(null);
        setForm({ name: '', description: '', category: 'other', price: '', isAvailable: true });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className={`p-2 md:p-6 lg:p-10 max-w-7xl mx-auto ${BG_COLOR}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-blue-500 drop-shadow">
                    <FaUtensils className="text-blue-500 text-2xl" /> Food Management
                </h2>
                <span className="text-slate-400 text-sm md:text-base">
                    {foods.length} item{foods.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="backdrop-blur bg-slate-800/80 shadow-xl rounded-2xl p-4 md:p-8 mb-10 grid gap-6 border border-slate-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                        type="text"
                        name="name"
                        placeholder="Food name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={inputBase}
                        autoComplete="off"
                    />
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inputBase}
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className={`${inputBase} min-h-[70px] resize-y`}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        min={0}
                        className={inputBase}
                    />
                    <label className="flex items-center gap-2 w-full md:w-auto text-slate-200">
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={form.isAvailable}
                            onChange={handleChange}
                            className="checkbox rounded-lg border-slate-500"
                        />
                        <span className="text-sm">Available</span>
                    </label>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                    <button
                        type="submit"
                        className="btn bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 text-white flex items-center gap-2 px-6 py-2 rounded-xl text-base transition"
                    >
                        <Plus size={18} /> {editingFood ? 'Update Food' : 'Add Food'}
                    </button>
                    {editingFood && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="btn bg-slate-600 hover:bg-slate-500 focus:ring-2 focus:ring-slate-400 text-slate-100 flex items-center gap-2 px-6 py-2 rounded-xl text-base transition"
                        >
                            <X size={18} /> Cancel
                        </button>
                    )}
                </div>
            </motion.form>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl shadow border border-slate-700 bg-slate-800/80 backdrop-blur">
                {loading ? (
                    <div className="text-center py-10">
                        <Loader2 className="animate-spin w-6 h-6 mx-auto text-slate-400" />
                    </div>
                ) : (
                    <table className="min-w-full text-sm md:text-base bg-transparent">
                        <thead className="bg-slate-900/80">
                            <tr>
                                <th className="py-4 px-4 text-left font-semibold text-slate-100 rounded-tl-2xl">Name</th>
                                <th className="py-4 px-4 text-left font-semibold text-slate-100">Category</th>
                                <th className="py-4 px-4 text-left font-semibold text-slate-100">Price ₹</th>
                                <th className="py-4 px-4 text-left font-semibold text-slate-100">Available</th>
                                <th className="py-4 px-4 text-left font-semibold text-slate-100 max-w-[180px] md:max-w-xs">Description</th>
                                <th className="py-4 px-4 text-center font-semibold text-slate-100 rounded-tr-2xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food, idx) => (
                                <tr key={food._id} className={`hover:bg-blue-900/40 transition ${idx === foods.length - 1 ? 'rounded-b-2xl' : ''}`}>
                                    <td className="py-3 px-4 font-medium text-slate-200">{food.name}</td>
                                    <td className="py-3 px-4 capitalize text-slate-300">{food.category}</td>
                                    <td className="py-3 px-4 text-slate-300">{Number(food.price).toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-base font-semibold ${food.isAvailable ? 'bg-green-700/20 text-green-300' : 'bg-red-700/20 text-red-300'}`}>
                                            {food.isAvailable ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 max-w-[180px] md:max-w-xs truncate text-slate-400" title={food.description || '-'}>
                                        {food.description || '-'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-2 md:gap-3">
                                            <button
                                                onClick={() => handleEdit(food)}
                                                className="text-blue-400 hover:text-blue-200 focus:ring-2 focus:ring-blue-400 p-2 rounded-full transition"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(food._id)}
                                                className="text-red-400 hover:text-red-200 focus:ring-2 focus:ring-red-400 p-2 rounded-full transition"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {foods.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-500 rounded-b-2xl text-lg">
                                        No food items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminFood;
