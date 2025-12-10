import React, {
  useState,
  useEffect,
  FC,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from "react";
import type { Article } from "@/types/Article"; // Import tipe Article
import Image from "next/image";

type ArticleFormModalProps = {
  article: Article | null; // Artikel yang sedang diedit (bisa null jika menambah baru)
  onSave: (article: Article) => void; // Fungsi onSave menerima objek Article yang lengkap
  onClose: () => void;
};

const ArticleFormModal: FC<ArticleFormModalProps> = ({
  article,
  onSave,
  onClose,
}) => {
  // Inisialisasi formData dengan Article
  const [formData, setFormData] = useState<Article>({
    id: article?.id || "",
    title: article?.title || "",
    image: article?.image || "",
    imageFile: null,
    content: article?.content || "",
    author: article?.author || "",
    publishDate: article?.publishDate || new Date().toISOString().slice(0, 10),
    summary: article?.summary || "",
  });

  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    if (article) {
      setFormData({
        id: article.id,
        title: article.title,
        image: article.image || "",
        imageFile: null,
        content: article.content,
        author: article.author,
        publishDate: article.publishDate,
        summary: article.summary || "",
      });
    } else {
      setFormData({
        id: "",
        title: "",
        image: "",
        imageFile: null,
        content: "",
        author: "",
        publishDate: new Date().toISOString().slice(0, 10),
        summary: "",
      });
    }
    setErrorMessage("");
  }, [article]);

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
        setFormData((prev) => ({ ...prev, image: "", imageFile: null }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: "", imageFile: null }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.content ||
      !formData.author ||
      !formData.publishDate
    ) {
      setErrorMessage(
        "Judul, Konten, Penulis, dan Tanggal Publikasi wajib diisi!"
      );
      setShowErrorModal(true);
      return;
    }

    const articleToSave: Article = {
      id: formData.id ?? "",
      title: formData.title,
      image: formData.image,
      imageFile: formData.imageFile,
      content: formData.content,
      author: formData.author,
      publishDate: formData.publishDate,
      summary: formData.summary,
    };

    setIsSubmitting(true);
    try {
      await onSave(articleToSave);
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-4 md:p-8 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative max-h-[90vh] overflow-y-auto">
        {/* Mengubah ukuran judul */}
        <h2 className="text-lg sm:text-xl font-extrabold text-blue-800 mb-6 text-center">
          {article ? "Edit Data Artikel" : "Tambah Artikel Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Artikel */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Judul Artikel:
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

          {/* Unggah Gambar Artikel */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Unggah Gambar Artikel:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              // required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB
            </p>
          </div>

          {/* Preview Gambar */}
          {formData.image && (
            <div className="mt-1 flex justify-center">
              <Image
                src={formData.image}
                alt="Preview Artikel"
                width={96}
                height={96}
                className="h-24 w-24 object-cover rounded-xl border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/96x96/e0e0e0/555555?text=File+Invalid";
                }}
              />
            </div>
          )}

          {/* Isi Artikel */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Isi Artikel:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          {/* Penulis & Tanggal Publikasi (Side-by-side on larger screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Penulis */}
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Penulis:
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>
            {/* Tanggal Publikasi */}
            <div>
              <label
                htmlFor="publishDate"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Tanggal Publikasi:
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>
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

export default ArticleFormModal;
