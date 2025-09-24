"use client";

import React, { useState, useEffect, useCallback, FC } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage);
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
          return;
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

        if (response.status === 413) {
          errorMessage = "Gagal menyimpan artikel. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return;
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manajemen Artikel</h1>
                  <p className="text-gray-600 mt-1">Kelola dan publikasikan artikel serta berita terbaru</p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Artikel
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 font-medium">Memuat data artikel...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="p-4 bg-red-100 rounded-full inline-block mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-lg mb-2">Terjadi Kesalahan</p>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Artikel
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Penulis
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Tanggal Publikasi
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg">Belum ada artikel</p>
                              <p className="text-gray-500 mt-1">Mulai dengan menambahkan artikel pertama Anda</p>
                            </div>
                            <button
                              onClick={() => handleAddEdit()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Tambah Artikel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      articles.map((item, index) => (
                        <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-gray-900 line-clamp-2" title={item.title}>
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">ID: {item.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.image ? (
                              <div className="relative">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                              {item.author}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-700 font-medium">
                                {new Date(item.publishDate).toLocaleDateString('id-ID', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(item.publishDate).toLocaleDateString('id-ID', { weekday: 'long' })}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleAddEdit(item)} 
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200" 
                                title="Edit Artikel"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)} 
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200" 
                                title="Hapus Artikel"
                              >
                                <TrashIcon className="h-4 w-4" />
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
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ArticleFormModal
          article={currentArticle}
          onSave={handleSaveArticle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default ArticlesPage;