// components/Card/JurusanCard.tsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FC } from "react";
import type { Major } from "@/types/Major";

const JurusanCard: FC<Major> = ({ id, name, description, image }) => {
  const linkHref = `/jurusan/${id}`;

  return (
    <motion.div
      className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer border border-blue-50 h-full flex flex-col"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link href={linkHref} className="block h-full flex-col">
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <Image
            src={
              image || "https://placehold.co/600x400/6B7280/FFFFFF?text=Major"
            }
            alt={name}
            fill
            style={{ objectFit: "cover", fontFamily: "Georgia, Serif" }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/600x400/6B7280/FFFFFF?text=Major";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3
            className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300"
            style={{ fontFamily: "Merriweather Sans" }}
          >
            {name}
          </h3>
          <p
            className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow"
            style={{ fontFamily: "Merriweather Sans" }}
          >
            {description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <span className="font-semibold text-blue-500 group-hover:text-blue-700 transition-colors duration-300">
              Pelajari Lebih Lanjut &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JurusanCard;
