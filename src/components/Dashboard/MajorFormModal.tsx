import React, {
  useState,
  useEffect,
  FC,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from "react";
import type { Major } from "@/types/Major";

type MajorFormModalProps = {
  major: Major | null;
  onSave: (major: Major) => Promise<void>;
  onClose: () => void;
};

// Define a local type for formData to handle potential `null` or `undefined` values for optional fields
// as they appear in the form state before being sent to the API.
type MajorFormData = {
  id: string | null;
  name: string;
  imagePreview: string; // preview URL/base64 for UI
  imageFile: File | null; // original file for upload
  description: string;
};

const MajorFormModal: FC<MajorFormModalProps> = ({
  major,
  onSave,
  onClose,
}) => {
  // Initialize formData without slug
  const [formData, setFormData] = useState<MajorFormData>({
    id: (major?.id as string) || null,
    name: major?.name || "",
    imagePreview: major?.image || "",
    imageFile: null,
    description: major?.description || "",
  });

  // State for validation errors
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    // When the 'major' prop changes, update the form data
    if (major) {
      setFormData({
        id: major.id as string,
        name: major.name,
        imagePreview: major.image || "",
        imageFile: null,
        description: major.description,
      });
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        imagePreview: "",
        imageFile: null,
      });
    }
    setErrorMessage(""); // Clear previous errors on prop change
  }, [major]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrorMessage(
          `Ukuran gambar maksimal adalah ${
            MAX_IMAGE_SIZE_BYTES / (1024 * 1024)
          }MB.`
        );
        setShowErrorModal(true);
        e.target.value = "";
        setFormData((prev) => ({ ...prev, imagePreview: "", imageFile: null }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagePreview: reader.result as string,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, imagePreview: "", imageFile: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      (!formData.id && !formData.imageFile)
    ) {
      setErrorMessage(
        "Nama dan Deskripsi wajib diisi. Gambar wajib untuk jurusan baru."
      );
      setShowErrorModal(true);
      return;
    }
    setErrorMessage(""); // Clear previous errors

    // Construct the Major object to be passed to onSave
    const majorToSave: Major = {
      ...(formData.id ? { id: formData.id } : {}),
      name: formData.name,
      description: formData.description,
      image: formData.imagePreview,
      imageFile: formData.imageFile ?? undefined,
    } as Major;

    try {
      setIsSubmitting(true);
      await onSave(majorToSave);
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
      {/* Mengubah lebar dan menambahkan scroll */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 md:p-12 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center">
          {major ? "Edit Data Jurusan" : "Tambah Jurusan Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Jurusan */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Nama Jurusan:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Unggah Gambar */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Unggah Gambar:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB
            </p>
          </div>

          {/* Preview Gambar */}
          {formData.imagePreview && (
            <div className="mt-2 flex justify-center">
              <img
                src={formData.imagePreview}
                alt="Preview Jurusan"
                className="h-24 w-24 object-cover rounded-full border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/96x96/e0e0e0/555555?text=File+Invalid";
                }}
              />
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Deskripsi:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition duration-200 ease-in-out shadow-sm text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
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
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in-up">
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

export default MajorFormModal;
