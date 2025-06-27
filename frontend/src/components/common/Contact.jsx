/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Loader2, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate async request
    setTimeout(() => {
      setIsLoading(false);

      toast.success("Message sent successfully", {
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #3b82f6",
        },
        iconTheme: {
          primary: "#3b82f6",
          secondary: "#fff",
        },
      });

      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4 sm:px-6 md:px-10 lg:px-20 py-16">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent"
        >
          Contact Hostel Management
        </motion.h1>
        <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Have questions, feedback, or issues? Reach out to the hostel team below.
        </p>
      </div>

      {/* Contact Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-[#1e293b] border border-blue-500/20 p-6 sm:p-10 rounded-xl shadow-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block mb-2 text-sm text-blue-200">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-blue-200">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="subject" className="block mb-2 text-sm text-blue-200">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Room booking, maintenance..."
            className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="message" className="block mb-2 text-sm text-blue-200">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          ></textarea>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </motion.form>

      {/* Contact Info */}
      <section className="mt-14 max-w-3xl mx-auto text-center text-blue-200 text-sm sm:text-base">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 px-4">
          <div className="flex flex-col items-center">
            <MapPin className="w-6 h-6 text-blue-400 mb-2" />
            <p>
              Hostel Campus,<br />
              Tech University, Cityname<br />
              400001
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="w-6 h-6 text-blue-400 mb-2" />
            <p>+91-12345-67890</p>
            <p>+91-98765-43210</p>
          </div>
          <div className="flex flex-col items-center">
            <Mail className="w-6 h-6 text-blue-400 mb-2" />
            <p>hostel@university.edu</p>
            <p>support@hostelservices.in</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
