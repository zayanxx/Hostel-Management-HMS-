/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Auth check: user or admin token
const getAuthStatus = () => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    return {
        isLoggedIn: !!userToken || !!adminToken,
        isAdmin: !!adminToken,
    };
};

const Navbar = () => {
    const [auth, setAuth] = useState(getAuthStatus());
    const location = useLocation();

    useEffect(() => {
        setAuth(getAuthStatus());
    }, [location]);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
        { to: "/admin-login", label: "AdminLogin" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
    };

    return (
        <nav className="sticky top-0 w-full z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="font-extrabold text-2xl md:text-3xl tracking-wide transition-transform duration-300 hover:scale-105"
                >
                    <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent drop-shadow-md filter saturate-150"
                    >
                        HMS
                    </motion.span>
                </Link>

                {/* Show nav links only if NOT logged in */}
                {!auth.isLoggedIn && (
                    <div className="hidden md:flex flex-1 justify-end items-center gap-6">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={label}
                                to={to}
                                className="hover:text-blue-400 transition-colors duration-200 font-medium text-base"
                            >
                                {label}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            className="ml-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-sm py-2 px-5 rounded-lg shadow"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {/* Logout Button for Logged In Users */}
                {auth.isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        className="ml-auto bg-red-500 hover:bg-red-600 transition text-white font-semibold text-sm py-2 px-5 rounded-lg shadow"
                    >
                        Logout
                    </button>
                )}

                {/* Mobile Menu Toggle */}
                {!auth.isLoggedIn && (
                    <MobileMenu navLinks={navLinks} />
                )}
            </div>
        </nav>
    );
};

// Mobile menu as a separate component for clarity
function MobileMenu({ navLinks }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <button
                className="md:hidden z-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    )}
                </svg>
            </button>
            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                    {/* Menu Panel */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-16 left-4 right-4 mx-auto rounded-xl shadow-lg md:hidden flex flex-col gap-2 px-6 pt-6 pb-6 z-50 bg-gradient-to-br from-slate-900 to-slate-800"
                    >
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className="text-base font-medium hover:text-blue-400 transition-all py-2 border-b border-white/10 last:border-b-0"
                            >
                                {label}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-sm py-2 px-5 rounded-lg shadow"
                        >
                            Login
                        </Link>
                    </motion.div>
                </>
            )}
        </>
    );
}

export default Navbar;
