"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blog" },
  ];

  const services = [
    { name: "Current Events Updates", href: "/services#consulting" },
    { name: "Medical Missionary Training", href: "/services#training" },
  ];

  return (
    <footer className="relative bg-[#F6F1EA] dark:bg-[#2A1A10]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10" />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="rounded-2xl p-6 border bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gospel Sounders Publications & Missions
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Revealing the Father and the Son
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                GS publications
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="rounded-2xl p-6 border bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="block px-2 py-1 rounded-lg text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="rounded-2xl p-6 border bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Our Services
              </h4>
              <ul className="space-y-3">
                {services.map((service, i) => (
                  <li key={i}>
                    <a
                      href={service.href}
                      className="block px-2 py-1 rounded-lg text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="rounded-2xl p-6 border bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Get In Touch
              </h4>

              <div className="space-y-3 mb-6 text-sm text-gray-700 dark:text-gray-300">
                <p>Kenya – Africa</p>
                <p><a
                  href="mailto:Gspublicationsmissions@gmail.com"
                  className="hover:underline"
                >
                  Gspublicationsmissions@gmail.com
                </a></p>
                <p><a href="tel:+254722878683" className="hover:underline">
                  +254 722 878683
                </a></p>
              </div>

              {/* Social Icons — UNTOUCHED */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Follow Us
                </h5>
                <div className="flex gap-3">
                  {[
                    { icon: FaFacebookF, href: "https://facebook.com/groups/435293693285693", color: "from-blue-500 to-blue-600" },
                       { icon: FaWhatsapp, href: "https://wa.me/254722878683", color: "from-green-500 to-emerald-500" },
                        { icon: FaYoutube, href: "https://youtube.com/@gospelsounders", color: "from-red-500 to-red-600" },
                    { icon: FaTwitter, href: "#", color: "from-cyan-500 to-blue-500" },
                    { icon: FaLinkedinIn, href: "#", color: "from-blue-600 to-blue-700" },
                    { icon: FaInstagram, href: "#", color: "from-pink-500 to-purple-500" },
                   
                 
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition`}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="text-center lg:text-left text-sm text-gray-600 dark:text-gray-400">
            © {year} Gospel Sounders Publications & Missions. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition"
          >
            <FaArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
