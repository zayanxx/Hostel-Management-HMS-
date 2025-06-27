import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Loader2, AlertCircle, BedDouble, Building2, DollarSign, Users, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const statusStyles = {
    available: 'bg-green-500 text-white animate-pulse',
    occupied: 'bg-red-500 text-white animate-bounce',
    maintenance: 'bg-yellow-400 text-black animate-pulse',
};

const ResidentRoom = () => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRoom = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You are not logged in.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get('https://hostel-management-fws2.onrender.com/api/room/myroom', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRoom(data);
        } catch (err) {
            toast.error(
                err?.response?.data?.message || 'Failed to fetch room details.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoom();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-white">
                <Toaster position="top-right" />
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                    <Loader2 className="animate-spin h-12 w-12 text-yellow-400 mb-2" />
                    <p className="text-lg font-medium tracking-wide">Loading your room details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-2 py-8 flex items-center justify-center">
            <Toaster position="top-right" />
            <div className="w-full max-w-2xl mx-auto bg-gray-800/90 border border-gray-700 rounded-2xl p-6 shadow-2xl backdrop-blur-md animate-fade-in">
                <div className="flex items-center gap-3 mb-7">
                    <Home size={32} className="text-yellow-400 drop-shadow-lg animate-bounce" />
                    <h2 className="text-3xl font-bold tracking-tight">My Room Details</h2>
                </div>

                {room && room.roomNumber ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-200">
                        <div className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                            <BedDouble className="text-blue-400" size={28} />
                            <div>
                                <div className="text-xs uppercase text-gray-400">Room Number</div>
                                <div className="text-lg font-semibold">{room.roomNumber}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                            <Building2 className="text-purple-400" size={28} />
                            <div>
                                <div className="text-xs uppercase text-gray-400">Type</div>
                                <div className="text-lg font-semibold">{room.type}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                            <Home className="text-green-400" size={28} />
                            <div>
                                <div className="text-xs uppercase text-gray-400">Floor</div>
                                <div className="text-lg font-semibold">{room.floor}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                            <Users className="text-pink-400" size={28} />
                            <div>
                                <div className="text-xs uppercase text-gray-400">Capacity</div>
                                <div className="text-lg font-semibold">{room.capacity}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                            <DollarSign className="text-yellow-400" size={28} />
                            <div>
                                <div className="text-xs uppercase text-gray-400">Monthly Rent</div>
                                <div className="text-lg font-semibold">
                                    ₹{Number(room.pricePerMonth).toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                            <AlertCircle className="text-orange-400" size={28} />
                            <div>
                                <div className="text-xs uppercase text-gray-400">Status</div>
                                <span
                                    className={`inline-block px-3 py-1 text-sm rounded-full font-semibold shadow ${statusStyles[room.status] || 'bg-gray-500 text-white'}`}
                                >
                                    {room.status}
                                </span>
                            </div>
                        </div>
                        <div className="sm:col-span-2 bg-gray-700/60 rounded-lg p-4 shadow mt-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="text-yellow-300" size={22} />
                                <span className="text-base font-semibold">Features</span>
                            </div>
                            {room.features?.length > 0 ? (
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    {room.features.map((feature, idx) => (
                                        <li key={idx} className="text-gray-300">{feature}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-gray-400">No special features listed.</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center text-red-400 mt-8 animate-fade-in">
                        <AlertCircle size={40} className="mx-auto mb-3 animate-bounce" />
                        <p className="text-lg font-semibold">No room assigned to your profile yet.</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-fade-in {
                    animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
                }
            `}</style>
        </div>
    );
};

export default ResidentRoom;
