// components/HeroSection.js
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Pastikan Heroicons terinstal

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Data untuk slider
  const slides = [
    {
      src: "/images/logo_sekolah.png", // Ganti dengan gambar hero pertama Anda
      alt: "Pemandangan modern SMKN 4 Mataram",
      title: "Selamat Datang di",
      subtitle: "SMK NEGERI 4 MATARAM",
      description: "Membentuk generasi unggul, berprestasi, dan siap menghadapi masa depan.",
      gradientFrom: "from-blue-800", // Lebih gelap untuk kontras
      gradientTo: "to-blue-500",    // Lebih cerah
    },
    {
      src: "/images/bg-hero-2.jpg", // Ganti dengan gambar hero kedua Anda
      alt: "Lingkungan belajar inovatif",
      title: "Inovasi Pendidikan",
      subtitle: "Fokus pada Keunggulan Vokasi",
      description: "Kurikulum adaptif yang selaras dengan industri terkini.",
      gradientFrom: "from-indigo-800",
      gradientTo: "to-purple-500",
    },
    {
      src: "/images/bg-hero-3.jpg", // Ganti dengan gambar hero ketiga Anda
      alt: "Kegiatan ekstrakurikuler siswa",
      title: "Ekstrakurikuler Beragam",
      subtitle: "Kembangkan Bakat dan Potensi",
      description: "Pilih dari berbagai kegiatan yang menginspirasi dan membangun karakter.",
      gradientFrom: "from-teal-800",
      gradientTo: "to-cyan-500",
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti slide setiap 5 detik
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToNextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden">
      {/* Gambar Latar Belakang dengan Transisi */}
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide.src}
          alt={slide.alt}
          layout="fill"
          objectFit="cover"
          quality={90}
          priority={index === 0} // Hanya gambar pertama yang diprioritaskan
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Overlay Gradasi Estetik */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${currentSlide.gradientFrom} via-transparent ${currentSlide.gradientTo} opacity-70 transition-colors duration-1000 ease-in-out`}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-50"></div>


      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 md:px-8">
        <div className="flex flex-col items-center space-y-3 md:space-y-5 lg:space-y-6 animate-fade-in-up">
          <p className="text-xl md:text-3xl font-semibold drop-shadow-md">
            {currentSlide.title}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-wide leading-tight drop-shadow-lg">
            {currentSlide.subtitle}
          </h1>
          <p className="text-base md:text-xl max-w-3xl font-light opacity-90 leading-relaxed drop-shadow-sm">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Navigasi Slider */}
      <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center space-x-8 z-20">
        {/* Tombol Kiri */}
        <button
          onClick={goToPrevSlide}
          className="p-3 bg-opacity-20 hover:bg-opacity-40 rounded-full text-white text-3xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>

        {/* Dots */}
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ease-in-out transform ${
                activeIndex === index ? 'bg-blue-500 scale-125 shadow-md' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Slide ${index + 1}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveIndex(index); }}
            />
          ))}
        </div>

        {/* Tombol Kanan */}
        <button
          onClick={goToNextSlide}
          className="p-3 bg-opacity-20 hover:bg-opacity-40 rounded-full text-white text-3xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}