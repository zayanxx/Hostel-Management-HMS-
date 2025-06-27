/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const teamMembers = [
  {
    name: "Zayan",
    role: "Warden",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Responsible for overall hostel management, discipline, and student welfare.",
  },
  {
    name: "Aisha Khan",
    role: "Maintenance Supervisor",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Ensures all hostel facilities are in top condition and timely repairs are made.",
  },
  {
    name: "Ravi Kumar",
    role: "Mess Manager",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    bio: "Oversees kitchen staff, meal plans, and hygiene standards in the mess.",
  },
  {
    name: "Priya Sharma",
    role: "Student Welfare Officer",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    bio: "Coordinates student programs, mental health support, and extracurriculars.",
  },
  {
    name: "Ali Raza",
    role: "Security Coordinator",
    image: "https://randomuser.me/api/portraits/men/73.jpg",
    bio: "Manages campus security, visitor logs, and safety protocols.",
  },
  {
    name: "Alan Paul",
    role: "Housekeeping Supervisor",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Ensures cleanliness and hygiene standards are maintained in all hostel areas.",
  }
];

const About = () => {
  const scrollRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4 sm:px-6 lg:px-20 py-16">
      {/* Header */}
      <div className="text-center mb-12 px-2">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent"
        >
          Meet Our Hostel Team
        </motion.h1>
        <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          The staff members dedicated to managing a safe, healthy, and supportive living environment.
        </p>
      </div>

      {/* Arrows for mobile */}
      <div className="flex justify-between items-center mb-6 md:hidden px-2 sm:px-4">
        <button
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          onClick={() => scroll(-300)}
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          onClick={() => scroll(300)}
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto md:overflow-x-hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 no-scrollbar pb-2"
      >
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="min-w-[240px] md:min-w-0 bg-[#1e293b] border border-blue-500/30 rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => setSelectedMember(member)}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-blue-400 shadow-md object-cover"
            />
            <h3 className="text-lg sm:text-xl font-bold">{member.name}</h3>
            <p className="text-blue-300 mt-1 text-sm">{member.role}</p>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
            />
            {/* Modal Box */}
            <motion.div
              className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md p-6 rounded-xl bg-[#1e293b] shadow-2xl text-white transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-blue-400">{selectedMember.name}</h3>
                <button onClick={() => setSelectedMember(null)}>
                  <X className="w-6 h-6 text-white hover:text-red-400" />
                </button>
              </div>
              <p className="text-sm text-blue-300 font-medium mb-2">{selectedMember.role}</p>
              <p className="text-sm text-gray-300">{selectedMember.bio}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
