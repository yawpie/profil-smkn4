// pages/hubungi-kami.tsx
import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

const HubungiKami: React.FC = () => {
  return (
    <MainLayout>
      <Head>
        <title>Hubungi Kami - SMKN 4 Mataram</title>
        <meta name="description" content="Informasi kontak SMKN 4 Mataram: alamat, telepon, email, dan media sosial." />
      </Head>

      {/* Hero Section - Professional Design */}
      <section className="relative w-full py-20 md:py-24 lg:py-28 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-16 left-1/3 w-24 h-24 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-slate-500 transform -rotate-45"></div>
          
          {/* Additional geometric elements */}
          <div className="absolute top-1/4 left-1/2 w-2 h-16 bg-white opacity-20 transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-2 bg-white opacity-20 transform -rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-12 bg-white opacity-20 transform rotate-45"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-1 h-16 bg-blue-500 mr-6"></div>
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Hubungi <span className="text-blue-400">Kami</span>
                  </h1>
                </div>
                <div className="w-1 h-16 bg-blue-500 ml-6"></div>
              </div>
              <div className="w-32 h-1 bg-blue-500 mx-auto mb-6"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Informasi kontak dan layanan komunikasi SMKN 4 Mataram
            </motion.p>
          </div>
        </div>
        
        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-slate-500 to-blue-500">
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-600"></div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Address Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-white shadow-lg border-l-4 border-blue-600 p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 bg-blue-600 mr-4"></div>
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">
                    Alamat Sekolah
                  </h2>
                </div>
                <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Jl. Pendidikan No.45, Dasan Agung Baru, Kec. Selaparang, Kota Mataram, Nusa Tenggara Barat 83114
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-slate-600 mr-4"></div>
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">
                    Informasi Kontak
                  </h2>
                </div>
                <div className="w-16 h-1 bg-slate-600 mb-6"></div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-slate-50 border-l-2 border-blue-500 hover:bg-slate-100 transition-colors duration-200">
                    <FontAwesomeIcon icon={faPhone} className="mr-4 text-blue-600 w-5 h-5" />
                    <div>
                      <p className="font-medium text-slate-900">+62 853-3746-4898</p>
                      <p className="text-xs text-slate-500 uppercase">Telepon Sekolah</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-slate-50 border-l-2 border-blue-500 hover:bg-slate-100 transition-colors duration-200">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-4 text-blue-600 w-5 h-5" />
                    <div>
                      <p className="font-medium text-slate-900">humassmekamtr@gmail.com</p>
                      <p className="text-xs text-slate-500 uppercase">Email Resmi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-slate-50 border-l-2 border-blue-500 hover:bg-slate-100 transition-colors duration-200">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-4 text-blue-600 w-5 h-5" />
                    <div>
                      <a
                        href="https://www.google.com/maps/place/SMK+Negeri+4+Mataram/@-8.5807917,116.0875991,17z/data=!3m1!4b1!4m6!3m5!1s0x2cdc0876cb2ae6b:0x38bf9a1f2e27acaa!8m2!3d-8.580797!4d116.090174!16s%2Fg%2F11b6zs68vg?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors duration-200"
                      >
                        Lihat di Google Maps
                      </a>
                      <p className="text-xs text-slate-500 uppercase">Lokasi</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-slate-600 mr-4"></div>
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">
                    Media Sosial
                  </h2>
                </div>
                <div className="w-16 h-1 bg-slate-600 mb-6"></div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-slate-50 border-l-2 border-blue-500 hover:bg-slate-100 transition-colors duration-200">
                    <FontAwesomeIcon icon={faFacebook} className="mr-4 text-blue-600 w-5 h-5" />
                    <div>
                      <a
                        href="https://www.facebook.com/smkn4mtrm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors duration-200"
                      >
                        Facebook
                      </a>
                      <p className="text-xs text-slate-500 uppercase">@smkn4mtrm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-slate-50 border-l-2 border-pink-500 hover:bg-slate-100 transition-colors duration-200">
                    <FontAwesomeIcon icon={faInstagram} className="mr-4 text-pink-600 w-5 h-5" />
                    <div>
                      <a
                        href="https://www.instagram.com/smkn4mtr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 hover:text-pink-600 transition-colors duration-200"
                      >
                        Instagram
                      </a>
                      <p className="text-xs text-slate-500 uppercase">@smkn4mtr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-slate-50 border-l-2 border-red-500 hover:bg-slate-100 transition-colors duration-200">
                    <FontAwesomeIcon icon={faYoutube} className="mr-4 text-red-600 w-5 h-5" />
                    <div>
                      <a
                        href="https://www.youtube.com/@media.smkn4mtr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 hover:text-red-600 transition-colors duration-200"
                      >
                        Youtube
                      </a>
                      <p className="text-xs text-slate-500 uppercase">@media.smkn4mtr</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <div className="bg-white shadow-lg border-l-4 border-green-600 p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 bg-green-600 mr-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">
                    Ada Pertanyaan?
                  </h3>
                </div>
                <div className="w-16 h-1 bg-green-600 mx-auto mb-6"></div>
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Tim SMKN 4 Mataram siap membantu Anda dengan informasi terkini tentang pendaftaran, program studi, dan kegiatan sekolah.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* <a 
                    href="tel:+6281805422671"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 border border-blue-600"
                  >
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                    Telepon Sekarang
                  </a> */}
                  <a 
                    href="mailto:humassmekamtr@gmail.com"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold transition-colors duration-200 border border-slate-600"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                    Kirim Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HubungiKami;