// components/Card/EkstrakurikulerCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { Extracurricular } from '@/types/Extracurricular'; // Mengimpor tipe Extracurricular

const EkstrakurikulerCard: FC<Extracurricular> = ({ id, name, description, image, coach, schedule }) => {
  const linkHref = id ? `/ekstrakurikuler/${id}` : '#'; // Gunakan ID untuk link detail atau fallback ke '#'

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.03 }} // Subtle scale on hover
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link href={linkHref} className="block"> {/* Menggunakan linkHref */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-t-xl">
          <Image
            src={image || '/images/default-extracurricular.jpg'} // Menggunakan 'image' atau fallback
            alt={name} // Menggunakan 'name' untuk alt text
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-4 left-4 right-4">
            {/* category tidak ada di tipe Extracurricular yang baru. Menggantinya dengan coach atau schedule jika relevan */}
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-md">
              {coach || 'Pelatih'} {/* Menampilkan nama pelatih atau fallback */}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
            {name} {/* Menggunakan 'name' untuk judul */}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            {/* date tidak ada di tipe Extracurricular yang baru. Menggantinya dengan schedule */}
            <span>{schedule}</span> {/* Menampilkan jadwal */}
            <span className="font-semibold text-blue-500 group-hover:text-blue-700 transition-colors duration-300">Lihat Detail &rarr;</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default EkstrakurikulerCard;