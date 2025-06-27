/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Loader2, Trash2, Pencil, AlertCircle, CheckCircle2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const statusIcons = {
    open: <AlertCircle className="inline mr-1 text-yellow-500" size={16} />,
    in_progress: <Loader2 className="inline mr-1 animate-spin text-blue-500" size={16} />,
    resolved: <CheckCircle2 className="inline mr-1 text-green-500" size={16} />,
    closed: <Trash2 className="inline mr-1 text-gray-400" size={16} />,
};

const statusLabels = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
};

const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
};

const AdminComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('https://hostel-management-fws2.onrender.com/api/complaint');
            setComplaints(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch complaints');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://hostel-management-fws2.onrender.com/api/complaint/${id}`);
            toast.success('Complaint deleted');
            setComplaints((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete complaint');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await axios.put(`https://hostel-management-fws2.onrender.com/api/complaint/${id}`, {
                status: newStatus,
            });
            setComplaints((prev) =>
                prev.map((c) => (c._id === id ? { ...c, status: res.data.status } : c))
            );
            toast.success('Status updated');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div
            className="p-4 min-h-screen flex flex-col items-center"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                transition: 'background 0.5s',
            }}
        >
            <ToastContainer theme="dark" />
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg text-center">
                    Complaint Management
                </h1>
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin w-10 h-10 text-slate-200 opacity-80" />
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-md fade-in">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 via-slate-100 to-blue-50 transition-all duration-500">
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Subject</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Priority</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {complaints.map((complaint) => (
                                    <tr key={complaint._id} className="hover:bg-slate-100/60 transition">
                                        <td className="px-4 py-3 text-slate-900">{complaint.subject}</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1">
                                                {statusIcons[complaint.status]}
                                                <select
                                                    value={complaint.status}
                                                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[complaint.priority] || 'bg-slate-200 text-slate-700'}`}
                                            >
                                                {complaint.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2 items-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full transition"
                                                title="Edit"
                                                // onClick={() => setSelectedComplaint(complaint)}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(complaint._id)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded-full transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {complaints.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-500">
                                            No complaints found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style>{`
                .fade-in {
                    animation: fadeIn 0.7s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px);}
                    to { opacity: 1; transform: none;}
                }
                thead tr {
                    background: linear-gradient(90deg,rgb(139, 161, 231) 0%,rgb(166, 194, 221) 50%,rgb(154, 171, 228) 100%);
                    transition: background 0.5s;
                }
            `}</style>
        </div>
    );
};

export default AdminComplaint;
