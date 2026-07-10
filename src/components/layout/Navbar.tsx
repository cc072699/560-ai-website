'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { SiteConfig, Product } from '@/types';

interface NavbarProps {
  site: SiteConfig;
  products: Product[];
}

export function Navbar({ site, products }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  // Filter products that should be shown in navbar
  const navProducts = products.filter((p) => p.showInNavbar);

  // Group categories dynamically
  const categories = Array.from(new Set(navProducts.map((p) => p.category)));
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white border-gray-150 shadow-sm'
          : 'bg-white/90 backdrop-blur-md border-gray-100'
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="text-blue-600 transition-transform duration-300 group-hover:scale-105">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[17px] font-extrabold tracking-tight text-gray-900 leading-tight transition-colors group-hover:text-blue-600">
              {site.companyName}
            </span>
            <span className="text-[9px] font-bold text-gray-400 tracking-[0.18em] uppercase leading-none mt-0.5">
              {site.companyNameEn}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-14 ml-auto mr-20">
          {site.nav.map((link) => {
            if (link.name === '产品介绍') {
              return (
                <div
                  key={link.name}
                  className="relative py-5"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link
                    href="/products"
                    className="text-[16px] text-gray-800 hover:text-blue-600 font-medium transition-colors flex items-center gap-1.5 group"
                  >
                    {link.name}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                  </Link>

                  {/* Mega Menu panel */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-[-150px] w-[860px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden flex"
                        style={{ marginTop: '0px' }}
                      >
                        {/* Left Side: Categories */}
                        <div className="w-[220px] bg-gray-50/70 border-r border-gray-100 p-5 flex flex-col gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3 text-left">
                            产品分类
                          </span>
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onMouseEnter={() => setActiveCategory(cat)}
                              className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-left flex items-center justify-between group/catbtn ${
                                activeCategory === cat
                                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                              }`}
                            >
                              <span>{cat}</span>
                              <svg
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  activeCategory === cat ? 'translate-x-0.5 text-blue-600' : 'opacity-0 group-hover/catbtn:opacity-100 text-gray-400'
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          ))}
                        </div>

                        {/* Right Side: Product cards grid */}
                        <div className="flex-1 p-6 bg-white">
                          <div className="grid grid-cols-2 gap-4 auto-rows-max">
                            {navProducts
                              .filter((p) => p.category === activeCategory)
                              .map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.id}`}
                                  onClick={() => setIsDropdownOpen(false)}
                                  className="group/card relative rounded-xl overflow-hidden aspect-[1.75/1] border border-gray-100 shadow-sm flex flex-col justify-end p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-blue-200"
                                >
                                  {/* Background Image */}
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={product.imageUrl}
                                    alt={product.imageAlt}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                  />
                                  {/* Dark Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/35 to-transparent transition-opacity duration-300 group-hover/card:from-blue-950/90 group-hover/card:via-blue-950/45" />

                                  {/* Text Content */}
                                  <div className="relative z-10 text-left">
                                    <h4 className="text-[14px] font-bold text-white leading-tight mb-1 group-hover/card:text-blue-200 transition-colors">
                                      {product.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-300 font-medium leading-normal line-clamp-2">
                                      {product.tagline}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Normal text anchor link (smart navigation: redirect to home if not on homepage)
            return (
              <Link
                key={link.name}
                href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                className="text-[16px] text-gray-800 hover:text-blue-600 font-medium transition-colors relative py-5 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            );
          })}
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
            <div className="flex flex-col py-6 px-6 gap-5 text-left">
              {site.nav.map((link) => {
                if (link.name === '产品介绍') {
                  return (
                    <div key={link.name} className="flex flex-col">
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="text-base text-gray-700 hover:text-blue-600 font-medium py-1 flex items-center justify-between w-full"
                      >
                        <span>{link.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileProductsOpen ? 'rotate-180' : ''
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 flex flex-col gap-2.5 mt-2 border-l border-gray-200 overflow-hidden"
                          >
                            <Link
                              href="/products"
                              className="text-sm text-blue-600 font-semibold py-1"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileProductsOpen(false);
                              }}
                            >
                              查看全部产品 →
                            </Link>
                            {navProducts.map((p) => (
                              <Link
                                key={p.id}
                                href={`/products/${p.id}`}
                                className="text-sm text-gray-600 hover:text-blue-600 py-1"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileProductsOpen(false);
                                }}
                              >
                                {p.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                    className="text-base text-gray-700 hover:text-blue-600 font-medium py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
