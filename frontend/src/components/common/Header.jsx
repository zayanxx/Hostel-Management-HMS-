/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaStar,
  FaWifi,
  FaBed,
  FaLock,
} from "react-icons/fa";
import homeImage from "../../assets/room1.jpg";

const reviews = [
  {
    name: "Alice",
    place: "Mumbai",
    text: "Super clean and friendly staff!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    stars: 5,
  },
  {
    name: "Bob",
    place: "Delhi",
    text: "Loved my stay. Spacious and secure rooms!",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    stars: 4,
  },
  {
    name: "Esha",
    place: "Bangalore",
    text: "Peaceful and modern facilities.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    stars: 4,
  },
];

const Header = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const moveSpotlight = (e) => {
      const { left, top } = spotlight.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      spotlight.style.setProperty("--x", `${x}px`);
      spotlight.style.setProperty("--y", `${y}px`);
    };
    window.addEventListener("mousemove", moveSpotlight);
    return () => window.removeEventListener("mousemove", moveSpotlight);
  }, []);

  return (
    <header
      ref={spotlightRef}
      className="relative min-h-screen flex flex-col items-center justify-start px-4 pt-12 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white"
    >
      {/* Background */}
      <img
        src={homeImage}
        alt="Hostel corridors and rooms"
        className="absolute inset-0 w-full h-full object-cover z-0"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Mouse-follow spotlight */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(600px_circle_at_var(--x,_--y),rgba(255,255,255,0.07),transparent)] transition-opacity duration-300" />

      {/* Hero */}
      <div className="relative z-30 text-center mt-8 sm:mt-12 px-2 sm:px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:animate-gradient-x"
        >
          <span className="hover:underline hover:decoration-2 hover:underline-offset-4 transition-all duration-300">
            Welcome to
          </span>{" "}
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300">
            Hostel Management
          </span>
        </motion.h1>
        <p className="max-w-xl mx-auto text-gray-300 text-sm sm:text-base mb-6">
          Streamlined management for a seamless hostel experience. Secure.
          Organized. Efficient.
        </p>

        {/* Contact Button */}
        <motion.a
          href="/contact"
          whileHover={{ scale: 1.07 }}
          className="relative inline-flex items-center px-6 py-3 border border-cyan-400 text-cyan-300 font-semibold rounded-md overflow-hidden group hover:text-white transition duration-300"
        >
          <FaPhoneAlt className="mr-2" />
          <span>Contact Us</span>
          <span className="absolute inset-0 border border-cyan-400 rounded-md pointer-events-none animate-border-move" />
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 opacity-20 blur-sm scale-150 group-hover:opacity-40 transition-all duration-500" />
        </motion.a>
      </div>

      {/* World Map */}
      <svg
        className="absolute w-full h-[400px] sm:h-[500px] bottom-0 left-0 opacity-10 z-10 pointer-events-none"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="dot" r="50%" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Dots */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = Math.random() * 1440;
          const y = Math.random() * 400;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2}
              fill="url(#dot)"
              className="animate-pulse"
            />
          );
        })}
        {/* Lines */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x1 = Math.random() * 1440;
          const y1 = Math.random() * 400;
          const x2 = Math.random() * 1440;
          const y2 = Math.random() * 400;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#00ffff"
              strokeOpacity="0.2"
              strokeWidth="1"
              className="animate-pulse"
            />
          );
        })}
      </svg>

      {/* Services Section */}
      <div className="relative z-30 mt-16 sm:mt-20 max-w-5xl w-full px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-2xl sm:text-3xl font-bold mb-6 text-cyan-300"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm sm:text-base">
          {[
            { icon: FaWifi, label: "High-speed Wi-Fi" },
            { icon: FaBed, label: "Comfortable Rooms" },
            { icon: FaLock, label: "24/7 Security" },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 border border-white/20 p-4 rounded-lg backdrop-blur-md hover:shadow-lg transition-all"
            >
              <service.icon className="text-cyan-300 text-3xl mb-2 mx-auto" />
              <p className="text-white">{service.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative z-30 w-full mt-12 sm:mt-16 lg:mt-20 px-2 sm:px-4">
        <div className="h-px bg-white/20 mb-4 w-full" />
        <div className="overflow-x-auto">
          <motion.div
            className="flex space-x-3 sm:space-x-6 snap-x snap-mandatory"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {[...reviews, ...reviews].map((review, i) => (
              <div
                key={i}
                className="snap-start flex-shrink-0 w-48 xs:w-56 sm:w-60 md:w-64 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-lg border border-white/20 shadow-md hover:scale-105 transition-transform duration-300 flex flex-col"
              >
                <div className="flex items-center mb-2">
                  <img
                    src={review.image}
                    alt={`Photo of ${review.name}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-2 border-2 border-cyan-300"
                  />
                  <div className="text-left">
                    <div className="text-cyan-200 font-semibold text-sm sm:text-base">
                      {review.name}
                    </div>
                    <div className="text-gray-300 text-xs italic">
                      {review.place}
                    </div>
                  </div>
                </div>
                <p className="text-gray-200 text-xs sm:text-sm leading-snug flex-grow">
                  {review.text}
                </p>
                <div className="flex mt-2">
                  {Array.from({ length: review.stars }).map((_, idx) => (
                    <FaStar
                      key={idx}
                      className="text-yellow-400 text-xs sm:text-sm mr-0.5"
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
