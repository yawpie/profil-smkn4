import { FC } from "react";
import MainLayout from "../components/layout/MainLayout";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import DaftarGuru from "@/components/layout/DaftarGuru";

const DaftarGuruPage: FC = () => {
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-24 lg:py-28 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-16 left-1/3 w-24 h-24 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-slate-500 transform -rotate-45"></div>
          <div className="absolute top-1/4 left-1/2 w-2 h-16 bg-white opacity-20 transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-2 bg-white opacity-20 transform -rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-12 bg-white opacity-20 transform rotate-45"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={headerVariants}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-1 h-16 bg-blue-500 mr-6"></div>
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Daftar <span className="text-blue-400">Guru</span>
                  </h1>
                </div>
                <div className="w-1 h-16 bg-blue-500 ml-6"></div>
              </div>
              <div className="w-32 h-1 bg-blue-500 mx-auto mb-6"></div>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Para pendidik profesional yang berdedikasi membentuk generasi
              unggul
            </motion.p>
          </div>
        </div>
      </section>

      {/* Organizational Chart Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Struktur Organisasi
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            <div className="relative w-full bg-white shadow-lg border border-slate-200 p-4">
              <Image
                src="/images/Organisasi.png"
                alt="Struktur Organisasi SMKN 4 Mataram"
                width={1600}
                height={900}
                layout="responsive"
                objectFit="contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Guru Normada */}
      <DaftarGuru
        jabatan="normada"
        title="Guru Normatif Adaptif"
        description="Menghadirkan pendidik profesional yang adaptif dan berlandaskan nilai-nilai normatif pendidikan."
        mode="full"
        itemsPerPage={9}
      />

      {/* Border between sections */}
      <div className="border-t border-slate-200"></div>

      {/* Section Guru BK */}
      <DaftarGuru
        jabatan="BK"
        title="Guru Bimbingan Konseling"
        description="Menghadirkan pendidik profesional yang adaptif dan berlandaskan nilai-nilai normatif pendidikan."
        mode="full"
        itemsPerPage={9}
      />
    </MainLayout>
  );
};

export default DaftarGuruPage;
