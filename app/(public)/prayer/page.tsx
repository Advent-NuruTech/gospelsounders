"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaPrayingHands, FaHeart, FaCheckCircle, FaPhone, FaEnvelope, FaUser } from "react-icons/fa";

export default function PrayerPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    request: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inspirationalQuotes = [
    "“The Lord is near to all who call upon Him.” – Psalm 145:18",
    "“Cast your burden upon the Lord, and He shall sustain you.” – Psalm 55:22",
    "“With God all things are possible.” – Matthew 19:26",
    "“God is our refuge and strength, a very present help in trouble.” – Psalm 46:1",
  ];

  const quote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "prayerRequests"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", request: "" });
    } catch (error) {
      console.error("Failed to submit prayer request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#3B2414] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#3B2414] to-[#6B4A2E] rounded-full mb-6 shadow-lg"
                >
                  <FaPrayingHands className="text-4xl text-[#F6F1EA]" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-extrabold text-[#3B2414] dark:text-[#F6F1EA] mb-4"
                >
                  Prayer Request
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-[#6B4A2E] dark:text-[#D8C9B4] max-w-2xl mx-auto"
                >
                  Share your heart with us. We&apos;re here to pray with you and support you through faith.
                </motion.p>

                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "6rem", opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 w-24 bg-gradient-to-r from-[#3B2414] via-[#6B4A2E] to-[#3B2414] mx-auto rounded-full mt-6"
                />
              </div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#F6F1EA] dark:bg-[#3B2414] rounded-2xl shadow-lg border border-[#6B4A2E] dark:border-[#D8C9B4] p-8 mb-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D8C9B4] dark:bg-[#6B4A2E]/30 rounded-xl flex items-center justify-center">
                    <FaHeart className="text-2xl text-[#3B2414] dark:text-[#F6F1EA]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-2">
                      We believe in the power of united prayer.
                    </h2>
                  </div>
                </div>

                {/* Verse Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#F6F1EA] to-[#D8C9B4] dark:from-[#3B2414]/20 dark:to-[#6B4A2E]/20 border-l-4 border-[#3B2414] dark:border-[#F6F1EA] rounded-xl p-6 mb-6">
                  <div className="absolute top-0 right-0 opacity-10">
                    <FaPrayingHands className="text-8xl text-[#3B2414]" />
                  </div>
                  <p className="relative italic text-[#3B2414] dark:text-[#F6F1EA] font-medium text-lg leading-relaxed">
                    &ldquo;The effectual fervent prayer of a righteous man availeth much.&rdquo;
                  </p>
                  <p className="relative text-[#6B4A2E] dark:text-[#D8C9B4] font-semibold mt-2">
                    — James 5:16
                  </p>
                </div>

                <div className="space-y-4 text-[#3B2414] dark:text-[#F6F1EA] leading-relaxed">
                  <p>
                    You are welcome to share your burdens, hopes, thanksgivings, and any requests on your heart. 
                    As Young Evangelists, we stand together in faith—lifting one another before God and trusting 
                    that He hears every prayer and answers according to His perfect will.
                  </p>
                  <p>
                    Once your request is submitted, our team will reach out to you with encouragement, prayer support, 
                    and guidance as God leads.
                  </p>
                </div>
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onSubmit={handleSubmit}
                className="bg-[#F6F1EA] dark:bg-[#3B2414] rounded-2xl shadow-lg border border-[#6B4A2E] dark:border-[#D8C9B4] p-8 space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-[#6B4A2E] dark:text-[#D8C9B4]" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 bg-[#F6F1EA] dark:bg-[#3B2414] border border-[#6B4A2E] dark:border-[#D8C9B4] rounded-xl text-[#3B2414] dark:text-[#F6F1EA] placeholder-[#6B4A2E] dark:placeholder-[#D8C9B4] focus:outline-none focus:ring-2 focus:ring-[#3B2414] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-[#6B4A2E] dark:text-[#D8C9B4]" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+254 700 000 000"
                      className="w-full pl-12 pr-4 py-3 bg-[#F6F1EA] dark:bg-[#3B2414] border border-[#6B4A2E] dark:border-[#D8C9B4] rounded-xl text-[#3B2414] dark:text-[#F6F1EA] placeholder-[#6B4A2E] dark:placeholder-[#D8C9B4] focus:outline-none focus:ring-2 focus:ring-[#3B2414] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA] mb-2">
                    Email Address <span className="text-[#6B4A2E] text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-[#6B4A2E] dark:text-[#D8C9B4]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-[#F6F1EA] dark:bg-[#3B2414] border border-[#6B4A2E] dark:border-[#D8C9B4] rounded-xl text-[#3B2414] dark:text-[#F6F1EA] placeholder-[#6B4A2E] dark:placeholder-[#D8C9B4] focus:outline-none focus:ring-2 focus:ring-[#3B2414] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Prayer Request */}
                <div>
                  <label className="block text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA] mb-2">
                    Your Prayer Request <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="request"
                    required
                    value={formData.request}
                    onChange={handleChange}
                    placeholder="Share your prayer request with us..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[#F6F1EA] dark:bg-[#3B2414] border border-[#6B4A2E] dark:border-[#D8C9B4] rounded-xl text-[#3B2414] dark:text-[#F6F1EA] placeholder-[#6B4A2E] dark:placeholder-[#D8C9B4] focus:outline-none focus:ring-2 focus:ring-[#3B2414] focus:border-transparent transition-all resize-none"
                  />
                  <p className="mt-2 text-xs text-[#6B4A2E] dark:text-[#D8C9B4]">
                    Your request will be kept confidential and handled with care.
                  </p>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                    loading 
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#3B2414] to-[#6B4A2E] hover:from-[#6B4A2E] hover:to-[#3B2414] text-[#F6F1EA] hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Your Request...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaPrayingHands />
                      Submit Prayer Request
                    </span>
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              {/* Success Card */}
{/* Success Card */}
<div className="bg-[#F6F1EA] dark:bg-[#3B2414] rounded-2xl shadow-xl border border-[#6B4A2E] dark:border-[#D8C9B4] p-8 text-center max-w-lg mx-auto">
  {/* Icon */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#3B2414] to-[#6B4A2E] rounded-full mb-4 shadow-lg"
  >
    <FaCheckCircle className="text-4xl text-[#F6F1EA]" />
  </motion.div>

  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 leading-snug">
    Thank You for Your Request! 🙏
  </h2>

  {/* Message */}
  <p className="text-base md:text-lg text-[#6B4A2E] dark:text-[#D8C9B4] mb-6 leading-relaxed">
    We will join you in prayer. May the Lord strengthen and uplift you in this season.
  </p>

  {/* Quote */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="relative overflow-hidden bg-gradient-to-br from-[#F6F1EA] to-[#D8C9B4] dark:from-[#3B2414]/20 dark:to-[#6B4A2E]/20 rounded-xl p-6 mb-6"
  >
    <div className="absolute top-0 right-0 opacity-10">
      <FaPrayingHands className="text-8xl text-[#3B2414]" />
    </div>
    <p className="relative italic text-[#3B2414] dark:text-[#F6F1EA] font-medium text-base md:text-lg leading-relaxed break-words">
      {quote}
    </p>
  </motion.div>

  {/* Button */}
  <motion.button
    onClick={() => setSuccess(false)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full px-6 py-3 bg-gradient-to-r from-[#3B2414] to-[#6B4A2E] hover:from-[#6B4A2E] hover:to-[#3B2414] text-[#F6F1EA] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
  >
    Submit Another Request
  </motion.button>
</div>


            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
