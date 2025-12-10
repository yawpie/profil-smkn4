// src/components/Dashboard/TeacherFormModal.tsx
import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from "react";
import type { Teacher } from "@/types/Teacher";

type TeacherFormModalProps = {
  teacher: Teacher | null; // Can be null if creating a new teacher
  onSave: (teacher: Teacher) => void;
  onClose: () => void;
};

const TeacherFormModal: FC<TeacherFormModalProps> = ({
  teacher,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Teacher>({
    id: teacher?.id || "",
    name: teacher?.name || "",
    image: teacher?.image || "", // This will now store a Data URL for preview, or an actual URL after upload
    subject: teacher?.subject || "",
    nip: teacher?.nip || "",
    position: teacher?.position || "",
    imageFile: null,
  });
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB in bytes
  useEffect(() => {
    // Memastikan form terisi dengan data terbaru saat modal dibuka atau 'teacher' berubah
    if (teacher) {
      setFormData(teacher);
    } else {
      // Reset form jika menambah guru baru
      setFormData({
        id: "",
        name: "",
        image: "",
        subject: "",
        nip: "",
        position: "",
      });
    }
  }, [teacher]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrorMessage(
          `Ukuran gambar maksimal adalah ${
            MAX_IMAGE_SIZE_BYTES / (1024 * 1024)
          }MB.`
        );
        setShowErrorModal(true);
        // Clear the file input and preview
        e.target.value = ""; // Resets the file input
        setFormData((prev) => ({ ...prev, image: "" })); // Clear preview
        return;
      }
      setFormData((prev) => ({ ...prev, imageFile: file }));
      // Read file as Data URL for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real application, you would upload this 'file' object to a storage service
        // (e.g., Firebase Storage, AWS S3) and then save the returned URL to formData.image.
        // For this example, we're using the Data URL for preview purposes.
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file); // Converts file to base64 string for preview
    } else {
      // If no file is selected (e.g., user cancels file dialog)
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validasi sederhana
    if (
      !formData.name ||
      !formData.subject ||
      !formData.nip ||
      !formData.position
    ) {
      setErrorMessage("Nama, Mata Pelajaran, NIP, dan Jabatan wajib diisi!");
      setShowErrorModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-5 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <h2 className="text-lg font-extrabold text-blue-800 mb-4 text-center">
          {teacher ? "Edit Data Guru" : "Tambah Guru Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Guru */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Nama Guru:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Unggah Gambar Profil */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Unggah Gambar Profil
            </label>
            <input
              type="file" // Changed to file input
              id="image"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/pjpeg" // Restrict to image files
              onChange={handleFileChange} // Use the new file handler
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB
            </p>
          </div>

          {/* Preview Gambar */}
          {formData.image && (
            <div className="mt-2 flex justify-center">
              <img
                src={formData.image}
                alt="Preview Profil"
                className="h-20 w-20 object-cover rounded-full border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/80x80/e0e0e0/555555?text=File+Invalid"; // Smaller placeholder
                }}
              />
            </div>
          )}

          {/* Mata Pelajaran */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Mata Pelajaran:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* NIP */}
          <div>
            <label
              htmlFor="nip"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              NIP:
            </label>
            <input
              type="number"
              id="nip"
              name="nip"
              value={formData.nip ?? ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Jabatan */}
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Jabatan:
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition duration-200 ease-in-out shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xs w-full text-center animate-fade-in-up">
            <p className="text-lg font-bold text-red-700 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={handleCloseErrorModal}
              className="px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-200 ease-in-out shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherFormModal;
