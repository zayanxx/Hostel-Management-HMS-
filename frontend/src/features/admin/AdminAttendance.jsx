import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isWithinInterval, parseISO } from 'date-fns';
import {
    User,
    MinusCircle,
    CheckCircle,
    XCircle,
    Clock,
    Edit2,
    Trash2,
    PlusCircle,
    Search,
    Calendar,
    Loader,
} from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://hostel-management-fws2.onrender.com/api/attendance';

const statusColors = {
    present: 'bg-green-100 text-green-800 border border-green-200',
    absent: 'bg-red-100 text-red-800 border border-red-200',
    late: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    default: 'bg-slate-200 text-slate-500 border border-slate-300',
};

const statusIcons = {
    present: <CheckCircle size={14} className="text-green-500" />,
    absent: <XCircle size={14} className="text-red-500" />,
    late: <Clock size={14} className="text-yellow-500" />,
    default: <MinusCircle size={14} className="text-slate-400" />,
};

const fadeIn = "animate-[fadeIn_0.4s_ease]";
const fadeInUp = "animate-[fadeInUp_0.5s_ease]";

const AdminAttendancePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [form, setForm] = useState({
        staff: '',
        date: '',
        checkInTime: '',
        checkOutTime: '',
        status: '',
    });
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const fetchAllAttendance = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_BASE_URL);
            setAllData(res.data || []);
            setFilteredData(res.data || []);
        } catch {
            setAllData([]);
            setFilteredData([]);
            toast.error('Failed to fetch attendance records');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllAttendance();
    }, []);

    useEffect(() => {
        let data = [...allData];
        if (search.trim()) {
            data = data.filter((record) => {
                const staffName =
                    typeof record.staff === 'object'
                        ? record.staff?.name || ''
                        : '';
                const staffId =
                    typeof record.staff === 'object'
                        ? record.staff?._id || ''
                        : record.staff || '';
                return (
                    staffName.toLowerCase().includes(search.toLowerCase()) ||
                    staffId.toLowerCase().includes(search.toLowerCase())
                );
            });
        }
        if (dateRange.from && dateRange.to) {
            data = data.filter((record) => {
                if (!record.date) return false;
                const date = parseISO(record.date);
                return isWithinInterval(date, {
                    start: parseISO(dateRange.from),
                    end: parseISO(dateRange.to),
                });
            });
        }
        setFilteredData(data);
    }, [search, dateRange, allData]);

    const openModal = (record = null) => {
        setEditRecord(record);
        setForm(
            record
                ? {
                      staff: typeof record.staff === 'object' ? record.staff._id : record.staff,
                      date: record.date ? record.date.slice(0, 10) : '',
                      checkInTime: record.checkInTime ? record.checkInTime.slice(0, 5) : '',
                      checkOutTime: record.checkOutTime ? record.checkOutTime.slice(0, 5) : '',
                      status: record.status || '',
                  }
                : { staff: '', date: '', checkInTime: '', checkOutTime: '', status: '' }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditRecord(null);
        setForm({ staff: '', date: '', checkInTime: '', checkOutTime: '', status: '' });
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editRecord) {
                await axios.put(`${API_BASE_URL}/${editRecord._id}`, form);
                toast.success('Attendance updated!');
            } else {
                await axios.post(API_BASE_URL, form);
                toast.success('Attendance created!');
            }
            await fetchAllAttendance();
            closeModal();
        } catch {
            toast.error('Failed to save attendance');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            toast.success('Attendance deleted!');
            await fetchAllAttendance();
        } catch {
            toast.error('Failed to delete attendance');
        }
    };

    const tableWrapperClass =
        "overflow-x-auto rounded-2xl shadow-2xl bg-white/90 backdrop-blur border border-slate-700 " +
        fadeIn;

    return (
        <div
            className="p-2 sm:p-4 md:p-6 min-h-screen"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            }}
        >
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <User size={28} className="text-blue-400" />
                        Staff Attendance
                    </h2>
                </div>
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-5">
                    <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-sm">
                        <Search size={20} className="text-blue-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by Staff ID or Name"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-sm">
                            <Calendar size={18} className="text-blue-400 mr-1" />
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
                                className="bg-transparent outline-none text-slate-900 text-xs sm:text-sm"
                            />
                        </div>
                        <span className="text-blue-400 font-bold">-</span>
                        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-sm">
                            <Calendar size={18} className="text-blue-400 mr-1" />
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
                                className="bg-transparent outline-none text-slate-900 text-xs sm:text-sm"
                            />
                        </div>
                        {(dateRange.from || dateRange.to) && (
                            <button
                                className="ml-2 text-xs px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300"
                                onClick={() => setDateRange({ from: '', to: '' })}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
                <div className={tableWrapperClass + " w-full"}>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm md:text-base">
                            <thead className="bg-slate-800 text-left font-semibold text-white sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 md:p-4 min-w-[120px]">
                                        <span className="flex items-center gap-2">
                                            <User size={18} className="text-blue-400" />
                                            Staff
                                        </span>
                                    </th>
                                    <th className="p-3 md:p-4 min-w-[100px]">Date</th>
                                    <th className="p-3 md:p-4 min-w-[90px]">Check-In</th>
                                    <th className="p-3 md:p-4 min-w-[90px]">Check-Out</th>
                                    <th className="p-3 md:p-4 min-w-[90px]">Status</th>
                                    <th className="p-3 md:p-4 min-w-[90px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-10 text-blue-400">
                                            <span className="flex flex-col items-center gap-2">
                                                <Loader className="animate-spin" size={36} />
                                                Loading...
                                            </span>
                                        </td>
                                    </tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((record, idx) => {
                                        const status = record.status?.toLowerCase() || 'default';
                                        return (
                                            <tr
                                                key={record._id}
                                                className={
                                                    "border-t border-slate-200 hover:bg-slate-100/80 transition-colors duration-200 " +
                                                    fadeInUp
                                                }
                                                style={{ animationDelay: `${idx * 40}ms` }}
                                            >
                                                <td className="p-3 md:p-4 max-w-[160px] truncate font-medium text-slate-800 flex items-center gap-2">
                                                    <User size={18} className="text-blue-400" />
                                                    {typeof record.staff === 'object'
                                                        ? record.staff?.name || record.staff?._id
                                                        : record.staff}
                                                </td>
                                                <td className="p-3 md:p-4 text-slate-700">
                                                    {record.date ? format(new Date(record.date), 'yyyy-MM-dd') : '—'}
                                                </td>
                                                <td className="p-3 md:p-4 text-slate-700">
                                                    {record.checkInTime ? format(new Date(record.checkInTime), 'hh:mm a') : '—'}
                                                </td>
                                                <td className="p-3 md:p-4 text-slate-700">
                                                    {record.checkOutTime ? format(new Date(record.checkOutTime), 'hh:mm a') : '—'}
                                                </td>
                                                <td className="p-3 md:p-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${statusColors[status] || statusColors.default} transition`}
                                                    >
                                                        {statusIcons[status] || statusIcons.default}
                                                        {record.status || '—'}
                                                    </span>
                                                </td>
                                                <td className="p-3 md:p-4 flex gap-2">
                                                    <button
                                                        onClick={() => openModal(record)}
                                                        className="flex items-center gap-1 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record._id)}
                                                        className="flex items-center gap-1 text-red-600 hover:bg-red-100 px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-red-300"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-10 text-slate-400">
                                            <span className="flex flex-col items-center gap-2">
                                                <MinusCircle size={36} className="text-slate-300" />
                                                No attendance records found.
                                            </span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal for create/update */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-all">
                    <form
                        onSubmit={handleSubmit}
                        className={
                            "bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-[95vw] max-w-md space-y-5 border border-blue-200 " +
                            fadeInUp
                        }
                    >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-blue-900 flex items-center gap-3">
                            {editRecord ? <Edit2 size={22} /> : <PlusCircle size={22} />}
                            {editRecord ? 'Edit' : 'Add'} Attendance
                        </h3>
                        <div className="space-y-3">
                            <label className="block text-sm md:text-base font-medium text-slate-700">
                                Staff ID
                                <input
                                    name="staff"
                                    value={form.staff}
                                    onChange={handleFormChange}
                                    placeholder="Staff ID"
                                    required
                                    className="w-full border border-blue-200 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                                />
                            </label>
                            <label className="block text-sm md:text-base font-medium text-slate-700">
                                Date
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full border border-blue-200 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                                />
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <label className="flex-1 block text-sm md:text-base font-medium text-slate-700">
                                    Check-In
                                    <input
                                        type="time"
                                        name="checkInTime"
                                        value={form.checkInTime}
                                        onChange={handleFormChange}
                                        className="w-full border border-blue-200 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                                    />
                                </label>
                                <label className="flex-1 block text-sm md:text-base font-medium text-slate-700">
                                    Check-Out
                                    <input
                                        type="time"
                                        name="checkOutTime"
                                        value={form.checkOutTime}
                                        onChange={handleFormChange}
                                        className="w-full border border-blue-200 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                                    />
                                </label>
                            </div>
                            <label className="block text-sm md:text-base font-medium text-slate-700">
                                Status
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full border border-blue-200 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                                >
                                    <option value="">Select Status</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                </select>
                            </label>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2 rounded bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm md:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm md:text-base"
                            >
                                {editRecord ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0 }
                    to { opacity: 1 }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-\\[fadeIn_0\\.4s_ease\\] {
                    animation: fadeIn 0.4s ease;
                }
                .animate-\\[fadeInUp_0\\.5s_ease\\] {
                    animation: fadeInUp 0.5s ease;
                }
            `}</style>
        </div>
    );
};

export default AdminAttendancePage;
