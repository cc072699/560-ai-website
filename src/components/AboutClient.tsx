'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  Headphones
} from 'lucide-react';
import Link from 'next/link';
import type { AboutPageData, SiteConfig } from '@/types';
import { ContactDialog } from '@/components/ContactDialog';

interface AboutClientProps {
  aboutPage: AboutPageData;
  site: SiteConfig;
}

const tagColors = ['bg-[#059669]', 'bg-[#E25C34]', 'bg-[#C08E32]', 'bg-[#2563EB]'];

export function AboutClient({ aboutPage, site }: AboutClientProps) {
  const [contactOpen, setContactOpen] = useState(false);

  // 1. Hover state for split section
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const isLeftActive = hoveredSide === 'left' || hoveredSide === null;
  const isRightActive = hoveredSide === 'right';

  const slides = aboutPage.slides || [];

  // 3D ring carousel state — cumulative rotation angle for smooth one-way circling
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const angleStep = 360 / (slides.length || 1);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setRotationAngle((prev) => prev - angleStep);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setRotationAngle((prev) => prev + angleStep);
  };

  const handleJumpTo = (index: number) => {
    const diff = index - activeIndex;
    const n = slides.length;
    // Normalize diff to [-n/2, n/2) range for shortest path
    const shortestDiff = ((diff + n / 2) % n) - n / 2;
    // Round to nearest integer (handle n/2 for odd n)
    const step = Math.round(shortestDiff);
    setActiveIndex(index);
    setRotationAngle((prev) => prev - step * angleStep);
  };

  // 2. Longshine Scroll Timeline active element detection
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
      <section className="relative w-full aspect-video flex items-center justify-center overflow-hidden z-10 bg-slate-900">
        {/* Background image - full display, no cropping */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={aboutPage.hero?.imageUrl || ''}
          alt="about hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay mask for perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-transparent z-10" />

        {/* Hero Text Overlay */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-20 max-w-[1440px] text-left w-full pt-16 md:pt-24">
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

      {/* 2. 3D Ring Carousel — image ring only, text above & below */}
      <section id="carousel-section" className="py-32 md:py-44 relative z-10 w-full overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px]">
          <div className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-5.5xl font-extrabold text-slate-900 tracking-tight">
              选择五六零，就是选择了
            </h2>
          </div>

          {/* === Active slide title — above ring === */}
          <div className="text-center mb-10 md:mb-14">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-200 tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
                {slides[activeIndex]?.category}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {slides[activeIndex]?.title}
            </h3>
          </div>

          {/* === 3D Ring Stage === */}
          <div className="relative flex flex-col items-center" style={{ perspective: '1800px' }}>

            {/* Ring container — image only */}
            <div className="relative w-full h-[300px] sm:h-[360px] md:h-[440px]">
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${rotationAngle}deg)`,
                  transition: 'transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                }}
              >
                {slides.map((slide, i) => {
                  const faceAngle = i * angleStep;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-[78%] sm:w-[68%] md:w-[62%] max-w-[800px]"
                      style={{
                        transform: `translate(-50%, -50%) rotateY(${faceAngle}deg) translateZ(320px)`,
                      }}
                    >
                      <div className="rounded-2xl overflow-hidden shadow-[0_24px_100px_-20px_rgba(0,0,0,0.4)] border border-white/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full aspect-[16/10] object-cover block"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left / Right arrows */}
            <button
              onClick={handlePrev}
              aria-label="上一项"
              className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="下一项"
              className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* === Description — below ring === */}
          <p className="mt-10 md:mt-14 text-base sm:text-lg md:text-xl text-slate-900 font-medium leading-relaxed max-w-2xl mx-auto text-center">
            {slides[activeIndex]?.description}
          </p>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8 md:mt-12">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleJumpTo(i)}
                aria-label={`第 ${i + 1} 项`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  i === activeIndex ? 'w-12 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
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

      {/* 3.5 Section Title — Culture (matches Philosophy style) */}
      <div className="relative w-full text-center pt-28 md:pt-40 pb-16 md:pb-20 bg-white">
        <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight">
          企业文化
        </h2>
        <div className="w-10 h-0.5 bg-blue-600 rounded mt-3 mx-auto" />
      </div>

      {/* 4. Brand Origin, Corporate Culture & Contact Us Combined */}
      <section
        ref={timelineRef}
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] bg-slate-950 pt-20 pb-24 overflow-hidden z-10 bg-fixed bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: `url('/uploads/about/city_skyscrapers_bg.jpg')`,
        }}
      >
        {/* Soft transparent dark overlay for legibility & balanced contrast */}
        <div className="absolute inset-0 bg-slate-950/45 pointer-events-none z-0" />

        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px] relative z-10 w-full text-center">

          {/* Header Title Area */}
          <div className="max-w-3xl mx-auto mb-28 text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6.5xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            >
              {aboutPage.culture?.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-cyan-300 text-xl md:text-2.5xl font-extrabold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              {aboutPage.culture?.subtitle}
              <span className="text-slate-100 text-base md:text-xl mt-4 block font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                {aboutPage.culture?.description}
              </span>
            </motion.p>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative max-w-5xl mx-auto mt-20 px-4 md:px-0">

            {/* Background inactive timeline track */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 border-r border-slate-700/50 -translate-x-1/2 pointer-events-none z-0" />

            {/* Active scroll-growing timeline track */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2.5px] bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-500 -translate-x-1/2 origin-top pointer-events-none z-10 shadow-[0_0_14px_rgba(16,185,129,0.7)]"
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
                        ? 'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-110'
                        : activeTimelineIndex >= index
                          ? 'border-emerald-600 bg-emerald-700 text-white'
                          : 'border-slate-700 bg-slate-900 text-slate-500'
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
              <h2 className="text-3xl md:text-5.5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
                联系我们 合作共赢
              </h2>
              <p className="text-slate-100 text-base md:text-xl font-bold leading-relaxed drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]">
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
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#008080] hover:bg-[#009999] active:bg-[#006666] text-white font-bold text-sm md:text-lg transition-all shadow-lg shadow-[#008080]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <Headphones className="w-5.5 h-5.5" />
                <span>预约咨询</span>
              </button>
            </div>
          </div>


        </div>
      </section>

      {/* 联系我们 弹窗 */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} site={site} />
    </div>
  );
}