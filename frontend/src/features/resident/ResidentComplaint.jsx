import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaDoorOpen, FaTag, FaAlignLeft, FaFlag } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const ResidentComplaint = () => {
  const [formData, setFormData] = useState({
    resident: '',
    room: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const [loading, setLoading] = useState(false);

  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://hostel-management-fws2.onrender.com/api/complaint', formData);
      toast.success('Complaint submitted successfully!');
      setFormData({
        resident: '',
        room: '',
        subject: '',
        description: '',
        priority: 'medium',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-2 py-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="w-full max-w-lg md:max-w-2xl bg-gray-800 text-white p-6 md:p-10 rounded-2xl shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FaFlag className="text-blue-400" /> Submit a Complaint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="resident" className="block mb-1 font-medium text-gray-300 flex items-center gap-2">
              <FaUser className="text-blue-400" /> Resident ID
            </label>
            <input
              type="text"
              name="resident"
              value={formData.resident}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your resident ID"
            />
          </div>

          <div>
            <label htmlFor="room" className="block mb-1 font-medium text-gray-300 flex items-center gap-2">
              <FaDoorOpen className="text-blue-400" /> Room ID (optional)
            </label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your room ID"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block mb-1 font-medium text-gray-300 flex items-center gap-2">
              <FaTag className="text-blue-400" /> Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Complaint subject"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium text-gray-300 flex items-center gap-2">
              <FaAlignLeft className="text-blue-400" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Describe the issue"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block mb-1 font-medium text-gray-300 flex items-center gap-2">
              <FaFlag className="text-blue-400" /> Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {priorities.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <FaFlag /> Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResidentComplaint;
