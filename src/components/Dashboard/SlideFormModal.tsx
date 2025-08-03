import React, { useState, useEffect, FC } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Impor PhotoIcon untuk input file
import type { Slide } from '@/types/Slide';

type SlideFormModalProps = {
  slide: Slide | null; // Data slide yang akan diedit, null jika menambah baru
  onSave: (slide: Slide) => void; // Fungsi untuk menyimpan data slide
  onClose: () => void; // Fungsi untuk menutup modal
};

const SlideFormModal: FC<SlideFormModalProps> = ({ slide, onSave, onClose }) => {
  const [formData, setFormData] = useState<Slide>(
    slide || {
      id: '',
      src: '', // URL gambar setelah diupload
      alt: '', // Alt text bisa di-generate dari title/description jika tidak ada input khusus
      title: '',
      subtitle: '',
      description: '',
      gradientFrom: '', // Default kosong, bisa diatur secara otomatis atau dihilangkan
      gradientTo: '',   // Default kosong, bisa diatur secara otomatis atau dihilangkan
      order: 0,
      isActive: true, // Default aktif
    }
  );

  // State baru untuk file gambar yang dipilih
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Efek ini akan mengisi ulang form data setiap kali prop 'slide' berubah
  useEffect(() => {
    if (slide) {
      setFormData(slide);
      setPreviewImage(slide.src); // Set preview dari slide yang ada
      setSelectedFile(null); // Reset selected file saat edit
    } else {
      setFormData({
        id: '', src: '', alt: '', title: '', subtitle: '', description: '',
        gradientFrom: '', gradientTo: '', order: 0, isActive: true
      });
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [slide]);

  // Efek untuk membuat URL preview saat file dipilih
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
      // Membersihkan object URL setelah komponen di-unmount atau file berubah
      return () => URL.revokeObjectURL(objectUrl);
    } else if (!slide) { // Hanya reset preview jika ini form tambah baru dan tidak ada file
      setPreviewImage(null);
    }
  }, [selectedFile, slide]);

  // Handler untuk perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk perubahan input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);
    setUploadError(null);

    let imageUrl = formData.src; // Gunakan URL yang sudah ada jika tidak ada file baru

    // Simulasi proses upload file
    if (selectedFile) {
      // --- LOGIKA UPLOAD FILE KE SERVER/CLOUD STORAGE ANDA DI SINI ---
      // Contoh:
      // const uploadData = new FormData();
      // uploadData.append('file', selectedFile);
      // try {
      //   const response = await fetch('/api/upload-image', { // Ganti dengan endpoint API upload Anda
      //     method: 'POST',
      //     body: uploadData,
      //   });
      //   if (!response.ok) throw new Error('Gagal mengunggah gambar.');
      //   const result = await response.json();
      //   imageUrl = result.url; // Asumsi API mengembalikan URL gambar yang diupload
      // } catch (err: any) {
      //   setUploadError(err.message || "Terjadi kesalahan saat mengunggah gambar.");
      //   setUploading(false);
      //   return; // Hentikan proses jika upload gagal
      // }

      // Simulasi sukses upload
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay simulasi
      imageUrl = URL.createObjectURL(selectedFile); // Untuk demo, gunakan URL objek lokal
      // Di produksi, imageUrl akan didapat dari respons server, misal: 'https://cdn.example.com/new-image.jpg'
    }

    setUploading(false);

    if (uploadError) return; // Jangan simpan jika ada error upload

    const finalSlideData: Slide = {
      ...formData,
      src: imageUrl, // Update src dengan URL gambar yang baru di-upload atau yang sudah ada
      alt: formData.alt || formData.title, // Alt text otomatis dari judul jika tidak diisi
    };

    onSave(finalSlideData); // Panggil fungsi onSave
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg p-4 shadow-xl w-full max-w-sm relative"> {/* Ukuran modal lebih kecil: max-w-sm, p-4 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
          aria-label="Tutup Modal"
        >
          <XMarkIcon className="h-4 w-4" /> {/* Ukuran ikon lebih kecil */}
        </button>
        <h2 className="text-lg font-bold text-blue-800 mb-4 pb-2 border-b border-gray-200"> {/* Ukuran judul lebih kecil, border bawah */}
          {slide ? 'Edit Slide' : 'Tambah Slide Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3"> {/* Spasi antar input lebih rapat */}
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-gray-700">Judul Utama</label>
            <input
              type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm text-black" // Text color changed to black
            />
          </div>
          <div>
            <label htmlFor="subtitle" className="block text-xs font-medium text-gray-700">Sub Judul</label>
            <input
              type="text" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm text-black" // Text color changed to black
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-gray-700">Deskripsi</label>
            <textarea
              id="description" name="description" value={formData.description} onChange={handleChange} rows={2} required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm text-black" // Text color changed to black
            />
          </div>

          {/* Input Unggah File Gambar */}
          <div>
            <label htmlFor="imageUpload" className="block text-xs font-medium text-gray-700 mb-1">Unggah Gambar Slide</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="file" id="imageUpload" name="image" accept="image/*" onChange={handleFileChange}
                className="block w-full text-xs text-gray-500
                          file:mr-3 file:py-1.5 file:px-3
                          file:rounded-full file:border-0
                          file:text-xs file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100 transition duration-150"
              />
              {uploading && (
                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            {uploadError && (
              <p className="mt-1 text-xs text-red-600">{uploadError}</p>
            )}
            {(previewImage || formData.src) && (
              <div className="mt-2 flex items-center space-x-2">
                <img
                  src={previewImage || formData.src}
                  alt="Pratinjau Gambar"
                  className="h-16 w-auto object-cover rounded-md shadow-sm border border-gray-200"
                />
                <span className="text-xs text-gray-500">Pratinjau Gambar</span>
              </div>
            )}
            {!previewImage && !formData.src && ( // Tampilkan placeholder jika belum ada gambar
              <div className="mt-2 h-16 w-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-md text-gray-400 text-xs">
                <PhotoIcon className="h-5 w-5 mr-1.5" /> Belum ada gambar dipilih
              </div>
            )}
          </div>

          <div>
            <label htmlFor="order" className="block text-xs font-medium text-gray-700">Urutan Tampil</label>
            <input
              type="number" id="order" name="order" value={formData.order} onChange={handleChange} required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm text-black" // Text color changed to black
            />
          </div>

          <div className="flex justify-end space-x-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              disabled={uploading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 transition"
              disabled={uploading} // Disable saat upload berlangsung
            >
              {uploading ? 'Mengunggah...' : (slide ? 'Simpan Perubahan' : 'Tambah Slide')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlideFormModal;