'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Target,
  Eye,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Phone,
  Headphones,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import type { AboutPageData, SiteConfig } from '@/types';

interface AboutClientProps {
  aboutPage: AboutPageData;
  site: SiteConfig;
}

const tagColors = ['bg-[#059669]', 'bg-[#E25C34]', 'bg-[#C08E32]', 'bg-[#2563EB]'];

export function AboutClient({ aboutPage, site }: AboutClientProps) {
  // 1. Hover state for split section
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const isLeftActive = hoveredSide === 'left' || hoveredSide === null;
  const isRightActive = hoveredSide === 'right';

  // 2. Longshine-style Carousel state
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = aboutPage.slides || [];

  // Auto-play slides every 6 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  // 3. Longshine Scroll Timeline active element detection
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);

  // useScroll and useSpring for drawing timeline path
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        if (!timelineRef.current) {
          ticking = false;
          return;
        }
        const rect = timelineRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Only process when timeline section is active in the viewport
        if (rect.top <= viewportHeight && rect.bottom >= 0) {
          let closestIndex = 0;
          let minDistance = Infinity;
          const targetY = viewportHeight / 2.5; // Matches JQuery about1() scrollY target height calculation

          cardRefs.current.forEach((card, index) => {
            if (!card) return;
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.top + cardRect.height / 2;
            const distance = Math.abs(cardCenter - targetY);

            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });

          setActiveTimelineIndex(closestIndex);
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden pb-0">
      {/* Premium Minimal Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.2] pointer-events-none z-0" />
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-0" />

      {/* 1. Immersive Full-Width Cover Banner */}
      <section className="relative w-full h-[70vh] min-h-[580px] md:h-[78vh] md:min-h-[680px] flex items-center justify-center overflow-hidden z-10">
        {/* Background image cover */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out scale-100"
          style={{
            backgroundImage: `url('${aboutPage.hero?.imageUrl || ""}')`,
            backgroundPosition: 'center 35%'
          }}
        />
        {/* Overlay mask for perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-transparent z-10" />

        {/* Hero Text Overlay */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-20 max-w-[1440px] text-left w-full pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-300 tracking-widest uppercase">关于我们 / ABOUT US</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8.5xl font-black text-white tracking-tight mb-8 leading-none"
          >
            {aboutPage.hero?.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-slate-200/90 max-w-2xl leading-relaxed font-normal mb-10 text-pretty whitespace-pre-line"
          >
            {aboutPage.hero?.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a
              href="#carousel-section"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-7 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              了解我们的核心优势 <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Editorial Slider Carousel */}
      <section id="carousel-section" className="py-28 md:py-44 relative z-10 w-full">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px]">
          <div className="text-center md:text-left mb-20">
            <h2 className="text-3xl md:text-5.5xl font-extrabold text-slate-900 tracking-tight mb-2">
              选择五六零，就是选择了
            </h2>
            <div className="w-20 h-1 bg-blue-600 rounded mt-4 mx-auto md:mx-0" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Left slide info panel */}
            <div className="lg:col-span-5 flex flex-col justify-between min-h-[380px] text-left">
              <div className="min-h-[260px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                  >
                    <span className="text-xs md:text-sm font-bold text-blue-600 tracking-wider block uppercase">
                      {slides[activeSlide]?.category}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {slides[activeSlide]?.title}
                    </h3>
                    <p className="text-slate-500 text-sm md:text-lg lg:text-xl leading-relaxed font-normal text-justify">
                      {slides[activeSlide]?.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-6 mt-10">
                {/* Arrow buttons */}
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={handlePrevSlide}
                    className="w-12 h-12 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 active:bg-slate-50 text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="w-12 h-12 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 active:bg-slate-50 text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Indicator dots */}
                <div className="flex items-center gap-3">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${activeSlide === index ? 'w-8 bg-blue-600' : 'w-3 bg-slate-250 hover:bg-slate-350'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right side rounded image view */}
            <div className="lg:col-span-7">
              <div className="rounded-[2.5rem] overflow-hidden aspect-[16/10] border border-slate-200/80 shadow-2xl relative min-h-[350px] md:min-h-[480px] lg:min-h-[560px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    src={slides[activeSlide]?.image}
                    alt={slides[activeSlide]?.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Philosophy (Cambricon style - Edge-to-Edge FULL SCREEN split with NO rounded borders) */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] bg-white border-t border-slate-200/40">
        {/* Title container - Centered above the split section */}
        <div className="w-full text-center py-12 md:py-16 bg-white">
          <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight">
            {aboutPage.philosophy?.title || "核心理念"}
          </h2>
          <div className="w-10 h-0.5 bg-blue-600 rounded mt-3 mx-auto" />
        </div>

        {/* Flat full-screen container with NO rounded corners and NO padding */}
        <div className="relative w-full flex flex-col md:flex-row h-auto md:h-[90vh] min-h-[600px] md:min-h-[850px] overflow-hidden bg-slate-100">

          {/* Left Column: Ecosystem (55% width on desktop, absolute left, slanted right edge, z-10) */}
          <div
            onMouseEnter={() => setHoveredSide('left')}
            onMouseLeave={() => setHoveredSide(null)}
            className={`relative md:absolute md:inset-y-0 md:left-0 w-full md:w-[55%] flex flex-col justify-center items-center text-center p-8 md:p-16 z-10 transition-all duration-700 ease-in-out cursor-pointer md:[clip-path:polygon(0_0,100%_0,80%_100%,0_100%)] min-h-[350px] md:min-h-0 ${isLeftActive ? 'bg-[#0b5be8] text-white shadow-2xl' : 'bg-[#FAFAFA] text-slate-800'
              }`}
          >
            {/* Background image overlay */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${isLeftActive ? 'mix-blend-luminosity opacity-50 scale-[1.03]' : 'mix-blend-normal opacity-[0.12] scale-100 grayscale'
                }`}
              style={{ backgroundImage: `url('${aboutPage.philosophy?.left?.image || ""}')` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ease-in-out ${isLeftActive ? 'opacity-100' : 'opacity-0'
              }`} />

            {/* Content container */}
            <div className="relative z-20 flex flex-col items-center max-w-xl px-6 transition-all duration-700">
              <h3 className={`text-3xl md:text-6xl font-black mb-5 tracking-tight transition-all duration-700 ${isLeftActive ? 'text-white' : 'text-slate-900'
                }`}>{aboutPage.philosophy?.left?.title}</h3>

              <div className={`h-2 mb-8 transition-all duration-700 ${isLeftActive ? 'bg-white w-20' : 'bg-blue-600 w-12'
                }`} />

              <p className={`text-base md:text-2.5xl leading-relaxed font-bold transition-all duration-700 whitespace-pre-line ${isLeftActive ? 'text-blue-50/95' : 'text-slate-500'
                }`}>
                {aboutPage.philosophy?.left?.description}
              </p>
            </div>
          </div>

          {/* Right Column: Technology (60% width on desktop, absolute right, z-0) */}
          <div
            onMouseEnter={() => setHoveredSide('right')}
            onMouseLeave={() => setHoveredSide(null)}
            className={`relative md:absolute md:inset-y-0 md:right-0 w-full md:w-[60%] flex flex-col justify-center items-center text-center p-8 md:p-16 md:pl-36 z-0 transition-all duration-700 ease-in-out cursor-pointer min-h-[350px] md:min-h-0 ${isRightActive ? 'bg-[#0b5be8] text-white shadow-2xl' : 'bg-[#FAFAFA] text-slate-800'
              }`}
          >
            {/* Background image overlay */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${isRightActive ? 'mix-blend-luminosity opacity-50 scale-[1.03]' : 'mix-blend-normal opacity-[0.12] scale-100 grayscale'
                }`}
              style={{ backgroundImage: `url('${aboutPage.philosophy?.right?.image || ""}')` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ease-in-out ${isRightActive ? 'opacity-100' : 'opacity-0'
              }`} />

            {/* Content container */}
            <div className="relative z-20 flex flex-col items-center max-w-xl px-6 transition-all duration-700">
              <h3 className={`text-3xl md:text-6xl font-black mb-5 tracking-tight transition-all duration-700 ${isRightActive ? 'text-white' : 'text-slate-900'
                }`}>{aboutPage.philosophy?.right?.title}</h3>

              <div className={`h-2 mb-8 transition-all duration-700 ${isRightActive ? 'bg-white w-20' : 'bg-blue-600 w-12'
                }`} />

              <p className={`text-base md:text-2.5xl leading-relaxed font-bold transition-all duration-700 whitespace-pre-line ${isRightActive ? 'text-blue-50/95' : 'text-slate-500'
                }`}>
                {aboutPage.philosophy?.right?.description}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Brand Origin, Corporate Culture & Contact Us Combined */}
      <section
        ref={timelineRef}
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] bg-[#001713] bg-gradient-to-b from-[#001713] via-[#00221b] to-[#011411] pt-32 pb-16 overflow-hidden border-t border-slate-900 z-10"
      >
        {/* Soft glowing ambient forest-teal radial backdrops */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.08] blur-[140px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/[0.08] blur-[140px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#002b22_1px,transparent_1px),linear-gradient(to_bottom,#002b22_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />

        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px] relative z-10 w-full text-center">

          {/* Header Title Area */}
          <div className="max-w-3xl mx-auto mb-28 text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6.5xl font-black text-white tracking-tight"
            >
              {aboutPage.culture?.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#10B981] text-xl md:text-2.5xl font-extrabold leading-relaxed"
            >
              {aboutPage.culture?.subtitle}
              <span className="text-slate-200 text-base md:text-xl mt-4 block font-medium leading-relaxed">
                {aboutPage.culture?.description}
              </span>
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4.5xl font-extrabold text-white tracking-tight pt-20"
            >
              {aboutPage.culture?.heading}
            </motion.h3>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative max-w-5xl mx-auto mt-20 px-4 md:px-0">

            {/* Background inactive timeline track */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#002b22] border-r border-[#00382d] -translate-x-1/2 pointer-events-none z-0" />

            {/* Active scroll-growing timeline track */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2.5px] bg-gradient-to-b from-[#10B981] via-[#059669] to-[#047857] -translate-x-1/2 origin-top pointer-events-none z-10 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
            />

            {/* Timeline Items */}
            <div className="space-y-24 md:space-y-36">
              {(aboutPage.culture?.timeline || []).map((item, index) => {
                const isLeft = index % 2 === 0;
                const tagColor = tagColors[index % tagColors.length];

                return (
                  <div key={index} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full">
                    {/* Left side: card for even, empty for odd */}
                    {isLeft ? (
                      <div
                        ref={(el) => { cardRefs.current[index] = el; }}
                        className="w-full md:w-[46%] max-w-[620px] z-10 flex justify-start md:justify-end"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6 }}
                          className={`relative w-full rounded-[2.2rem] overflow-hidden p-8 text-left shadow-2xl border transition-all duration-500 group min-h-[280px] md:min-h-[340px] flex flex-col justify-between ${activeTimelineIndex === index
                              ? 'border-[#10B981]/50 bg-slate-950 scale-100 shadow-[0_20px_50px_rgba(16,185,129,0.18)]'
                              : 'border-transparent bg-slate-950/60 opacity-65 scale-95'
                            }`}
                        >
                          {/* Full Card Background Image */}
                          <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                            <img
                              src={item.image}
                              className={`absolute inset-0 w-full h-full object-cover ${index === 0 ? 'opacity-35' : 'opacity-50 group-hover:scale-105 transition-transform duration-700'}`}
                              alt={item.tag}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-950/80 to-transparent z-10" />
                          </div>

                          {index === 0 ? (
                            <div className="relative z-10 flex flex-col justify-between h-full w-full">
                              {/* Top Swatch row */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-b border-slate-800/80 pb-4 mb-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="text-[#10B981]">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
                                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-base font-black text-white leading-tight">五六零 AI</span>
                                    <span className="text-[8px] font-bold text-slate-500 tracking-wider">560 AI TECH</span>
                                  </div>
                                </div>

                                {/* Swatches capsules */}
                                <div className="flex gap-2">
                                  <span className="px-2.5 py-1 rounded bg-[#0b5be8] text-[9px] text-white font-bold shadow-sm">科技蓝</span>
                                  <span className="px-2.5 py-1 rounded bg-[#10B981] text-[9px] text-white font-bold shadow-sm">生态绿</span>
                                  <span className="px-2.5 py-1 rounded bg-[#030F26] text-[9px] text-white font-bold shadow-sm">深邃黑</span>
                                </div>
                              </div>

                              {/* Main text content */}
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-md ${tagColor} text-xs font-black text-white tracking-widest uppercase mb-4 shadow-sm`}>
                                  {item.tag}
                                </span>
                                <h4 className="text-xl md:text-2.5xl font-black text-white mb-3 tracking-tight">{item.title}</h4>
                                <p className="text-slate-200 text-sm md:text-base leading-relaxed text-justify font-medium whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative z-10 flex flex-col justify-end h-full w-full">
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-md ${tagColor} text-xs font-black text-white tracking-widest uppercase mb-4 shadow-sm`}>
                                  {item.tag}
                                </span>
                                <h4 className="text-xl md:text-2.5xl font-black text-white mb-3 tracking-tight leading-tight">{item.title}</h4>
                                <p className="text-slate-100 text-sm md:text-base leading-relaxed text-justify font-medium whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      <div className="hidden md:block w-[46%]" />
                    )}

                    {/* Center dot (Node) */}
                    <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border transition-all duration-500 flex items-center justify-center text-xs font-bold z-20 select-none ${activeTimelineIndex === index
                        ? 'border-[#10B981] bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] scale-110'
                        : activeTimelineIndex >= index
                          ? 'border-[#059669] bg-[#059669] text-white'
                          : 'border-[#00382d] bg-[#001713] text-[#004d3e]'
                      }`}>
                      {item.node}
                    </div>

                    {/* Right side: empty for even, card for odd */}
                    {isLeft ? (
                      <div className="hidden md:block w-[46%]" />
                    ) : (
                      <div
                        ref={(el) => { cardRefs.current[index] = el; }}
                        className="w-full md:w-[46%] max-w-[620px] pl-12 md:pl-0 z-10 flex justify-start"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: 40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6 }}
                          className={`relative w-full rounded-[2.2rem] overflow-hidden p-8 text-left shadow-2xl border transition-all duration-500 group min-h-[280px] md:min-h-[340px] flex flex-col justify-between ${activeTimelineIndex === index
                              ? 'border-[#10B981]/50 bg-slate-950 scale-100 shadow-[0_20px_50px_rgba(16,185,129,0.18)]'
                              : 'border-transparent bg-slate-950/60 opacity-65 scale-95'
                            }`}
                        >
                          {/* Full Card Background Image */}
                          <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                            <img
                              src={item.image}
                              className={`absolute inset-0 w-full h-full object-cover ${index === 0 ? 'opacity-35' : 'opacity-50 group-hover:scale-105 transition-transform duration-700'}`}
                              alt={item.tag}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-950/80 to-transparent z-10" />
                          </div>

                          {index === 0 ? (
                            <div className="relative z-10 flex flex-col justify-between h-full w-full">
                              {/* Top Swatch row */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-b border-slate-800/80 pb-4 mb-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="text-[#10B981]">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
                                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-base font-black text-white leading-tight">五六零 AI</span>
                                    <span className="text-[8px] font-bold text-slate-500 tracking-wider">560 AI TECH</span>
                                  </div>
                                </div>

                                {/* Swatches capsules */}
                                <div className="flex gap-2">
                                  <span className="px-2.5 py-1 rounded bg-[#0b5be8] text-[9px] text-white font-bold shadow-sm">科技蓝</span>
                                  <span className="px-2.5 py-1 rounded bg-[#10B981] text-[9px] text-white font-bold shadow-sm">生态绿</span>
                                  <span className="px-2.5 py-1 rounded bg-[#030F26] text-[9px] text-white font-bold shadow-sm">深邃黑</span>
                                </div>
                              </div>

                              {/* Main text content */}
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-md ${tagColor} text-xs font-black text-white tracking-widest uppercase mb-4 shadow-sm`}>
                                  {item.tag}
                                </span>
                                <h4 className="text-xl md:text-2.5xl font-black text-white mb-3 tracking-tight">{item.title}</h4>
                                <p className="text-slate-200 text-sm md:text-base leading-relaxed text-justify font-medium whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative z-10 flex flex-col justify-end h-full w-full">
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-md ${tagColor} text-xs font-black text-white tracking-widest uppercase mb-4 shadow-sm`}>
                                  {item.tag}
                                </span>
                                <h4 className="text-xl md:text-2.5xl font-black text-white mb-3 tracking-tight leading-tight">{item.title}</h4>
                                <p className="text-slate-100 text-sm md:text-base leading-relaxed text-justify font-medium whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider line before Contact */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px] mt-32 mb-20 border-t border-slate-800/40 relative z-10 w-full" />

        {/* Glowing geometric glassmorphism backdrops on the bottom right */}
        <div className="absolute bottom-0 right-0 w-[55%] h-[480px] overflow-hidden pointer-events-none hidden md:block z-0 select-none">
          <div className="absolute top-[5%] right-[5%] w-[80%] h-[90%] rotate-[28deg] border-l-[3px] border-[#10B981]/25" />
          <div className="absolute top-[15%] right-[10%] w-[60%] h-[70%] rotate-[28deg] border-l-2 border-teal-500/30" />
          <div className="absolute top-[0%] right-[18%] w-[40%] h-[100%] rotate-[28deg] bg-gradient-to-l from-[#10B981]/5 via-teal-500/5 to-transparent blur-md" />
        </div>

        {/* Contact Section Content */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px] relative z-10 w-full flex flex-col gap-16 pb-4">

          {/* Top Row: Title & Action Buttons */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-16 text-left w-full">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-5.5xl font-black text-white tracking-tight leading-tight">
                联系我们 合作共赢
              </h2>
              <p className="text-slate-400 text-base md:text-xl font-normal leading-relaxed">
                我们会安排专业的顾问为您答疑解惑
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 relative z-10">
              {/* Outline Phone pill */}
              <a
                href={`tel:${site.contact.phone || '0779-3221560'}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-bold text-sm md:text-lg transition-all bg-white/5 hover:bg-white/10 active:scale-[0.98]"
              >
                <Phone className="w-5 h-5 text-slate-300" />
                <span>{site.contact.phone || '0779-3221560'}</span>
              </a>

              {/* Teal consultation pill */}
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#008080] hover:bg-[#009999] active:bg-[#006666] text-white font-bold text-sm md:text-lg transition-all shadow-lg shadow-[#008080]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
              >
                <Headphones className="w-5.5 h-5.5" />
                <span>预约咨询</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row: Logo (Left) and WeChat/Douyin QR hover + Mascot (Right) */}
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 w-full z-20 relative">

            {/* Bottom Left Logo */}
            <div className="flex items-center gap-3.5 select-none">
              <div className="text-blue-500">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-tight text-white leading-tight">
                  {site.companyName}
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-[0.18em] uppercase leading-none mt-0.5">
                  {site.companyNameEn}
                </span>
              </div>
            </div>

            {/* Bottom Right WeChat, Douyin, Mascot */}
            <div className="flex items-center gap-4">

              {/* WeChat QR hover trigger */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow">
                  <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.56 12.83c0-1.74 1.76-3.15 3.92-3.15 2.16 0 3.92 1.41 3.92 3.15 0 1.74-1.76 3.15-3.92 3.15-2.16 0-3.92-1.41-3.92-3.15zm-2.2-4.8c0 2.1 2.13 3.82 4.76 3.82 2.63 0 4.76-1.72 4.76-3.82 0-2.1-2.13-3.82-4.76-3.82-2.63 0-4.76 1.72-4.76 3.82z" />
                  </svg>
                </button>
                {/* Popover QR code card */}
                <div className="absolute bottom-12 right-1/2 translate-x-1/2 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-2xl hidden group-hover:flex flex-col items-center justify-center transition-all z-50 w-32 h-32">
                  <img src={site.wechatQrUrl || "/uploads/1783561335632-8i7n4ravjv6.png"} className="w-full h-full object-contain rounded-lg" alt="微信公众号" />
                  <span className="text-[9px] font-bold text-slate-400 mt-1.5 block">微信扫码关注</span>
                </div>
              </div>

              {/* Douyin QR hover trigger */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.53.02c.08 0 .15.02.21.08.38.38.8.72 1.25 1.01.96.63 2.05 1.01 3.2 1.13.06 0 .11.02.15.07.03.04.05.09.05.15v2.85c0 .12-.1.21-.22.21h-.14c-1.34 0-2.61-.41-3.67-1.12v9.31c0 3.75-3.04 6.79-6.79 6.79s-6.79-3.04-6.79-6.79 3.04-6.79 6.79-6.79c.64 0 1.25.09 1.83.26.11.03.18.13.18.25v2.84c0 .12-.08.21-.2.23-.55-.12-1.13-.19-1.81-.19-2.2 0-3.99 1.79-3.99 3.99s1.79 3.99 3.99 3.99 3.99-1.79 3.99-3.99V0c0-.02 0-.03.01-.05l.02-.02c.03-.03.06-.05.1-.05h3.31z" />
                  </svg>
                </button>
                {/* Popover QR code card */}
                <div className="absolute bottom-12 right-1/2 translate-x-1/2 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-2xl hidden group-hover:flex flex-col items-center justify-center transition-all z-50 w-32 h-32">
                  <img src={site.douyinQrUrl || site.wechatQrUrl || "/uploads/1783561335632-8i7n4ravjv6.png"} className="w-full h-full object-contain rounded-lg" alt="抖音官方号" />
                  <span className="text-[9px] font-bold text-slate-400 mt-1.5 block">抖音扫码关注</span>
                </div>
              </div>

              {/* Bot Mascot Button with speech bubble */}
              <div className="relative group flex items-center">
                {/* Speech bubble */}
                <div className="absolute right-12 bg-white text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-200/80 hidden group-hover:block whitespace-nowrap z-50 transition-all select-none">
                  获取专属解决方案 <span className="text-teal-600">⚡</span>
                </div>
                <Link
                  href="/#contact"
                  className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-teal-500/20 active:scale-[0.95]"
                >
                  <Bot className="w-5 h-5 animate-pulse" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}