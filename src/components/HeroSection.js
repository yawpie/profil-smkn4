import Image from 'next/image';
import { useState } from 'react';

export default function HeroSection() {

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden">

      <Image
        src="/images/logo_SMKN4.jpg"
        alt="Selamat Datang di SMKN 4 Mataram"
        layout="fill"
        objectFit="cover"
        quality={90}
        priority
      />

      <div className="absolute inset-0 bg-black bg-opacity-50"
        style={{ backgroundImage: "url('/images/coba.png')" }}
      ></div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="flex flex-col items-center space-y-2 md:space-y-4">
          <Image
            src="/images/logo_SMKN4.jpg"
            alt="Logo Sekolah"
            width={100}
            height={100}
            className="rounded"
          />
          <p className="text-lg md:text-xl font-semibold">Selamat Datang</p>
          <h2 className="text-xl md:text-2xl font-light">Di</h2>
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


// export default function GuruForm({ onAddGuru }) {
//   const [name, setName] = useState("");
//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !title || !image) return;

//     const newGuru = {
//       name,
//       title,
//       image: preview, // base64 preview
//     };

//     onAddGuru(newGuru);

//     // Reset
//     setName("");
//     setTitle("");
//     setImage(null);
//     setPreview(null);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 max-w-md">
//       <h2 className="text-lg font-semibold">Tambah Guru</h2>
//       <div>
//         <label className="block text-sm font-medium">Nama</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full border px-3 py-2 rounded mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium">Jabatan</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border px-3 py-2 rounded mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium">Foto Guru</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="mt-1"
//           required
//         />
//         {preview && (
//           <img
//             src={preview}
//             alt="Preview"
//             className="mt-2 h-32 w-32 object-cover rounded"
//           />
//         )}
//       </div>
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Tambah
//       </button>
//     </form>
//   );
// }   