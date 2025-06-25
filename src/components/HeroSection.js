import Image from 'next/image';
import { useState } from 'react';

export default function HeroSection() {

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden">

      <Image
        src="/images/logo_sekolah.png"
        alt="Selamat Datang di SMKN 4 Mataram"
        layout="fill"
        objectFit="cover"
        quality={90}
        priority
      />

      <div className="absolute inset-0 bg-black bg-opacity-50"
        style={{ backgroundImage: "url('/images/.png')" }}
      ></div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="flex flex-col items-center space-y-2 md:space-y-4">
          {/* <Image
            src="/images/logo_SMKN4.jpg"
            alt="Logo Sekolah"
            width={100}
            height={100}
            className="rounded"
          /> */}
          <p className="text-lg md:text-2xl font-semibold">Selamat Datang</p>
          <h2 className="text-xl md:text-2xl font-semibold">Di</h2>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide">
            SMK NEGERI 4 MATARAM
          </h1>
        </div>

        {/* Slider Navigation */}
        <div className="mt-8 flex items-center space-x-6">
          {/* Tombol kiri */}
          <button
            onClick={() => setActiveIndex((prev) => (prev === 0 ? 2 : prev - 1))}
            className="text-white text-2xl font-bold hover:text-blue-400 focus:outline-none"
            aria-label="Previous slide"
          >
            &lt;
          </button>

          {/* Dots */}
          <div className="flex space-x-3">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-4 h-4 rounded-full cursor-pointer transition-colors ${
                  activeIndex === index ? 'bg-blue-500' : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Slide ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveIndex(index); }}
              />
            ))}
          </div>

          {/* Tombol kanan */}
          <button
            onClick={() => setActiveIndex((prev) => (prev === 2 ? 0 : prev + 1))}
            className="text-white text-2xl font-bold hover:text-blue-400 focus:outline-none"
            aria-label="Next slide"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}