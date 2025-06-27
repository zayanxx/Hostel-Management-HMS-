/* eslint-disable no-unused-vars */
// src/pages/ResidentSuggestion.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { SendHorizonal } from 'lucide-react';

const ResidentSuggestion = () => {
  const [form, setForm] = useState({ name: '', subject: '', content: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Attach token
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    fetchMySuggestions();
  }, []);

  const fetchMySuggestions = async () => {
    try {
      const res = await axios.get('https://hostel-management-fws2.onrender.com/suggestion/my-suggestions');
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    if (!form.name || !form.content) {
      return setErrors(['Name and content are required']);
    }

    try {
      setLoading(true);
      await axios.post('https://hostel-management-fws2.onrender.com/api/suggestion', {
        ...form,
        email: 'resident@example.com' // temp placeholder or auto-set in backend
      });

      setForm({ name: '', subject: '', content: '' });
      setSuccess('Suggestion submitted successfully!');
      fetchMySuggestions();
    } catch (err) {
      const resp = err.response?.data;
      setErrors(resp?.errors ? resp.errors.map(e => e.msg) : [resp?.message || 'Failed to submit']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 text-white">
      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold text-center">Suggestions</h1>

        {/* Feedback */}
        {errors.length > 0 && (
          <div className="bg-red-800 text-red-200 p-4 rounded">
            <ul className="list-disc list-inside">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}
        {success && (
          <div className="bg-green-800 text-green-200 p-4 rounded text-center">
            {success}
          </div>
        )}

        {/* Suggestion Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded space-y-4 shadow">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full bg-gray-700 text-white rounded p-2"
            required
          />
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject (optional)"
            className="w-full bg-gray-700 text-white rounded p-2"
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Your suggestion..."
            rows={5}
            className="w-full bg-gray-700 text-white rounded p-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-2 rounded flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <SendHorizonal size={18} /> {loading ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </form>

        {/* My Suggestions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Suggestions</h2>
          {suggestions.length === 0 ? (
            <p className="text-gray-400">No suggestions submitted yet.</p>
          ) : (
            suggestions.map(sug => (
              <motion.div
                key={sug._id}
                className="bg-gray-800 p-4 rounded shadow"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-white">{sug.subject || 'No subject'}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sug.status === 'new' ? 'bg-yellow-600' :
                    sug.status === 'under_review' ? 'bg-blue-600' :
                    sug.status === 'implemented' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {sug.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{sug.content}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Submitted on {new Date(sug.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ResidentSuggestion;