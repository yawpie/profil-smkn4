// components/Card/EkstrakurikulerCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { Extracurricular } from '@/types/Extracurricular';
import RichTextRenderer from '../RichTextRenderer';

const EkstrakurikulerCard: FC<Extracurricular> = ({ id, name, description, image, coach, schedule }) => {
  const linkHref = id ? `/ekstrakurikuler/${id}` : '#';

  return (
    <motion.div
      className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer border border-blue-50 h-full flex flex-col"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      style={{ fontFamily: "Merriweather Sans" }}
    >
      <Link href={linkHref} className="block h-full flex-col">
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <Image
            src={image || "/images/default-extracurricular.jpg"}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-md">
              {coach || "Pelatih"}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
            {name}
          </h3>
          <RichTextRenderer
            content={description}
            className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow"
          />
          {/* <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {description}
          </p> */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <span>{schedule}</span>
            <span className="font-semibold text-blue-500 group-hover:text-blue-700 transition-colors duration-300">
              Lihat Detail &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default EkstrakurikulerCard;