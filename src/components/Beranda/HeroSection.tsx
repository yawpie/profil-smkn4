// components/Beranda/HeroSection.tsx
"use client";

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Slide } from '@/types/Slide'; // Pastikan path ini benar

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]); // Data slide dari API
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data slide dari API
  const fetchSlides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/slides'); // Panggil API Anda
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Slide[] = await response.json();
      setSlides(data);
      if (data.length > 0) {
        setActiveIndex(0); // Reset ke slide pertama jika data baru
      }
    } catch (e: unknown) {
      console.error("Failed to fetch slides:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat slide: ${e.message}`);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui saat memuat slide.");
      }
      // Fallback ke slide statis jika terjadi error (opsional)
      // setSlides([
      //   // ... fallback slides statis yang ada sebelumnya
      // ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides(); // Panggil saat komponen pertama kali di-mount
  }, [fetchSlides]);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]); // Bergantung pada slides.length

  const goToNextSlide = () => {
    if (slides.length > 0) {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }
  };

  const goToPrevSlide = () => {
    if (slides.length > 0) {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const currentSlide = slides[activeIndex];

  if (loading) {
    return (
      <section className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden bg-gray-200 animate-pulse flex items-center justify-center font-sans">
        <p className="text-gray-600 text-xl">Memuat slide...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden bg-red-100 flex items-center justify-center font-sans">
        <p className="text-red-700 text-center text-lg px-4">{error}</p>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden bg-blue-100 flex items-center justify-center font-sans">
        <p className="text-blue-700 text-center text-lg px-4">Belum ada slide hero yang tersedia.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden font-sans">
      {slides.map((slide, index) => (
        <Image
          key={slide.id} // Gunakan ID unik dari data
          src={slide.src}
          alt={slide.alt}
          layout="fill"
          objectFit="cover"
          quality={90}
          priority={index === 0}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Overlay gradasi utama dari bawah ke atas - Warna premium dan opacity disesuaikan */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${currentSlide.gradientFrom} via-transparent ${currentSlide.gradientTo} opacity-60 transition-colors duration-1000 ease-in-out`}
      ></div>
      {/* Overlay gradasi dari atas ke bawah (menambahkan sedikit kegelapan di atas untuk kontras judul) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-30"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 md:px-6">
        <div className="flex flex-col items-center space-y-2 md:space-y-3 lg:space-y-4 animate-fade-in-up">
          <p className="text-lg md:text-2xl font-semibold drop-shadow-md">
            {currentSlide.title}
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wide leading-tight drop-shadow-lg">
            {currentSlide.subtitle}
          </h1>
          <p className="text-sm md:text-lg max-w-2xl font-light opacity-90 leading-relaxed drop-shadow-sm">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Navigasi (Panah dan Indikator) */}
      {slides.length > 1 && ( // Hanya tampilkan navigasi jika ada lebih dari 1 slide
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center space-x-6 z-20">
          <button
            onClick={goToPrevSlide}
            className="p-2 bg-blue-900 bg-opacity-30 hover:bg-opacity-50 rounded-full text-white text-2xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <span
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out transform ${
                  activeIndex === index ? 'bg-blue-400 scale-125 shadow-md' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Slide ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveIndex(index);
                }}
              />
            ))}
          </div>

          <button
            onClick={goToNextSlide}
            className="p-2 bg-blue-900 bg-opacity-30 hover:bg-opacity-50 rounded-full text-white text-2xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-7 w-7" />
          </button>
        </div>
      )}
    </section>
  );
}