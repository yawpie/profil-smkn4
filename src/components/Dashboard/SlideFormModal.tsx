import React, {
  useState,
  useEffect,
  FC,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import type { Slide } from "@/types/Slide";

type SlideFormModalProps = {
  slide: Slide | null;
  onSave: (slide: Slide) => void;
  onClose: () => void;
};

const SlideFormModal: FC<SlideFormModalProps> = ({
  slide,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Slide>({
    id: slide?.id || "",
    image: slide?.image || "",
    alt: slide?.alt || "",
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    gradientFrom: slide?.gradientFrom || "",
    gradientTo: slide?.gradientTo || "",
    order: slide?.order || 1,
    isActive: slide?.isActive ?? true,
    imageFile: null,
  });
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const MAX_SLIDE_ORDER = 3;

  useEffect(() => {
    if (slide) {
      setFormData({ ...slide, imageFile: null });
    } else {
      setFormData({
        id: "",
        image: "",
        alt: "",
        title: "",
        subtitle: "",
        description: "",
        gradientFrom: "",
        gradientTo: "",
        order: 1,
        isActive: true,
        imageFile: null,
      });
    }
  }, [slide]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`Ukuran gambar maksimal adalah ${MAX_FILE_SIZE_MB}MB.`);
        setShowErrorModal(true);
        e.target.value = "";
        setFormData((prev) => ({ ...prev, imageFile: null }));
        return;
      }
      setFormData((prev) => ({ ...prev, imageFile: file }));
    } else {
      setFormData((prev) => ({ ...prev, imageFile: null }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (formData.order > MAX_SLIDE_ORDER) {
    //   setErrorMessage(
    //     `Urutan tampil tidak boleh lebih dari ${MAX_SLIDE_ORDER}.`
    //   );
    //   setShowErrorModal(true);
    //   return;
    // }

    if (!formData.imageFile && (!slide || !slide.imageFile)) {
      setErrorMessage("Gambar slide wajib diunggah atau dipilih.");
      setShowErrorModal(true);
      return;
    }

    const finalSlideData: Slide = {
      ...formData,
      alt: formData.alt || formData.title || "Gambar Slide",
      isActive: formData.isActive ?? true,
    };

    onSave(finalSlideData);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const imageUrl = formData.imageFile
    ? URL.createObjectURL(formData.imageFile)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-6 md:p-12 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
          aria-label="Tutup Modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center">
          {slide ? "Edit Slide" : "Tambah Slide Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Judul Utama: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Sub Judul:
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Deskripsi: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="imageUpload"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Gambar Slide:
              </label>
              <input
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maksimal {MAX_FILE_SIZE_MB}MB
              </p>
            </div>

            {imageUrl ? (
              <div className="mt-1 flex flex-col justify-center items-center">
                <p className="text-xs text-gray-600 mb-2">Pratinjau Gambar:</p>
                <img
                  src={imageUrl}
                  alt="Pratinjau Slide"
                  className="h-24 w-auto max-w-full object-cover rounded-xl border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/200x100/e0e0e0/555555?text=File+Invalid";
                  }}
                />
              </div>
            ) : (
              <div className="mt-1 flex flex-col items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-xl text-gray-400 text-sm h-32">
                <PhotoIcon className="h-8 w-8 mb-1" />
                <span>Belum ada gambar</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Urutan Tampil: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                max={MAX_SLIDE_ORDER}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm font-semibold text-gray-700"
              >
                Aktifkan Slide
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
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
              disabled={isSubmitting || !!errorMessage}
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
              {isSubmitting
                ? "Menyimpan..."
                : slide
                ? "Simpan Perubahan"
                : "Tambah Slide"}
            </button>
          </div>
        </form>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in-up">
            <p className="text-lg font-bold text-red-700 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={handleCloseErrorModal}
              className="px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-200 ease-in-out shadow-md text-base"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideFormModal;
