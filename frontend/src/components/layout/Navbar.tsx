'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '公司简介', href: '#about' },
    { name: '产品介绍', href: '#products' },
    { name: '客户案例', href: '#cases' },
    { name: '联系我们', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white border-gray-150 shadow-sm'
          : 'bg-white/90 backdrop-blur-md border-gray-100'
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo (Optimized for a grand, established enterprise look) */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          {/* Custom SVG Neural Stack / Computing Engine Icon - Grand & Professional */}
          <div className="text-blue-600 transition-transform duration-300 group-hover:scale-105">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Double-line corporate wordmark for premium layout */}
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold tracking-tight text-gray-900 leading-tight transition-colors group-hover:text-blue-600">
              五六零人工智能科技
            </span>
            <span className="text-[9px] font-bold text-gray-400 tracking-[0.18em] uppercase leading-none mt-0.5">
              560 AI TECHNOLOGY
            </span>
          </div>
        </Link>

        {/* Right: Menu Links (Tencent-style clean layout, with larger spacing and offset from the absolute right) */}
        <nav className="hidden md:flex items-center gap-14 ml-auto mr-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[16px] text-gray-800 hover:text-blue-600 font-medium transition-colors relative py-5 group"
            >
              {link.name}
              {/* Bottom active-bar line on hover */}
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col py-6 px-6 gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base text-gray-700 hover:text-blue-600 font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
