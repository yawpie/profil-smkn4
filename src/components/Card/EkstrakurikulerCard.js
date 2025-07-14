// components/Card/EkstrakurikulerCard.js
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import motion

export default function EkstrakurikulerCard({ id, slug, title, description, imageUrl, date, category }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.03 }} // Subtle scale on hover
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link href={`/ekstrakurikuler/${slug}`} className="block">
        <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl || '/images/default-extracurricular.jpg'} // Fallback image
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-110" // Zoom on hover
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="font-semibold text-blue-500 group-hover:text-blue-700 transition-colors duration-300">Lihat Detail &rarr;</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}