import { motion, Variants } from "framer-motion";
// import { sectionVariants as varian } from "../framer-motion/sectionVariants";

export default function ContentNotAvailableCard({
  title,
  content,
  sectionVariants,
}: {
  title?: string;
  content?: string;
  sectionVariants?: Variants;
}) {
  sectionVariants = sectionVariants;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="bg-white border-2 border-blue-200 shadow-lg p-12 max-w-2xl mx-auto text-center"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
        {title || "Konten Tidak Tersedia"}
      </h3>
      <p className="text-base text-gray-600">
        {content || "Maaf, konten ini belum tersedia saat ini."}
      </p>
    </motion.div>
  );
}
