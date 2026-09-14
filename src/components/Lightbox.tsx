import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-5xl max-h-[90vh] w-full h-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              style={{ objectFit: "contain" }}
              quality={90}
            />
          </motion.div>
          <button
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/70 w-10 h-10 flex items-center justify-center transition-colors duration-200"
            onClick={onClose}
            aria-label="Tutup gambar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
