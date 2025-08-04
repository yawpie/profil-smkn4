"use client";

import React, { useState, useEffect, useCallback, FC } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ArticleFormModal from '@/components/Dashboard/ArticleFormModal';
import type { Article } from '@/types/Article';
import type { Notification } from '@/types/Notification';

const ArticlesPage: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data artikel dari API
  const fetchArticles = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        // Gunakan pesan error dari backend jika ada, jika tidak, pakai pesan status
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage); // Tetap throw untuk menonaktifkan loading dan menampilkan error di halaman
      }
      const data: Article[] = await response.json();
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return dateB - dateA;
      });
      setArticles(sortedData);
    } catch (e: unknown) {
      console.error("Failed to fetch articles:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat artikel. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleAddEdit = (article: Article | null = null) => {
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        const response = await fetch(`/api/articles?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
          const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
          setNotification({ message: errorMessage, type: 'error' });
          console.error('Backend Error Response for DELETE:', errorData);
          return; // Hentikan eksekusi
        }
        setNotification({ message: 'Artikel berhasil dihapus!', type: 'success' });
        fetchArticles();
      } catch (e: unknown) {
        console.error("Failed to delete article:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus artikel: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus artikel. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  };

  const handleSaveArticle = async (newArticle: Article) => {
    try {
      const method = newArticle.id ? 'PUT' : 'POST';
      const response = await fetch('/api/articles', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        // Cek apakah error 413, lalu berikan pesan yang lebih jelas
        if (response.status === 413) {
          errorMessage = "Gagal menyimpan artikel. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return; // Hentikan eksekusi
      }
      setNotification({ message: `Artikel berhasil ${newArticle.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentArticle(null);
      fetchArticles();
    } catch (e: unknown) {
      console.error("Failed to save article:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan artikel: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan artikel. Silakan coba lagi.', type: 'error' });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
            ✍️ Manajemen Artikel
          </h1>
          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Artikel
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-8">Memuat data artikel...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Gambar</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Penulis</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Tanggal Publikasi</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500">Belum ada data artikel.</td>
                  </tr>
                ) : (
                  articles.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-100">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.title}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg object-cover border border-blue-200 shadow" />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(item.publishDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleAddEdit(item)} className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200" title="Edit">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200" title="Hapus">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <ArticleFormModal
            article={currentArticle}
            onSave={handleSaveArticle}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ArticlesPage;