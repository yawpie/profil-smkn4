// src/pages/dashboard/articles.js
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ArticleFormModal from '../../components/Dashboard/ArticleFormModal';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // Tambah state loading
  const [error, setError] = useState(null);     // Tambah state error

  // Fungsi untuk mengambil data artikel dari API
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles'); // Fetch dari API Route Anda
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data);
    } catch (e) {
      console.error("Failed to fetch articles:", e);
      setError("Gagal memuat data artikel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(); // Panggil fetchArticles saat komponen pertama kali dimuat
  }, []);

  const handleAddEdit = (article = null) => {
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        const response = await fetch(`/api/articles?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
        setNotification({ message: 'Artikel berhasil dihapus!', type: 'success' });
        fetchArticles(); // Ambil ulang data setelah penghapusan
      } catch (e) {
        console.error("Failed to delete article:", e);
        setNotification({ message: `Gagal menghapus artikel: ${e.message}`, type: 'error' });
      }
    }
  };

  const handleSaveArticle = async (newArticle) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNotification({ message: `Artikel berhasil ${newArticle.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentArticle(null);
      fetchArticles(); // Ambil ulang data setelah disimpan
    } catch (e) {
      console.error("Failed to save article:", e);
      setNotification({ message: `Gagal menyimpan artikel: ${e.message}`, type: 'error' });
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="p-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
        <span>📰</span>
        <span className="text-blue-700">Manajemen Artikel Sekolah</span>
          </h1>
          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Artikel
          </button>
        </div>

        {/* Loading & Error */}
        {loading ? (
          <div className="text-center py-8 text-gray-700">Memuat data artikel...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Judul</th>
                  <th className="px-6 py-3 text-left">Gambar</th>
                  <th className="px-6 py-3 text-left">Konten</th>
                  <th className="px-6 py-3 text-left">Penulis</th>
                  <th className="px-6 py-3 text-left">Tanggal Publikasi</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-6 text-center text-gray-500 bg-gray-50">
                      Belum ada data artikel.
                    </td>
                  </tr>
                ) : (
                  articles.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50 hover:bg-blue-100 transition duration-150"}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-12 w-12 rounded-lg object-cover shadow"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2 max-w-xs">{item.content}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{item.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{item.publishDate}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAddEdit(item)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition"
                            title="Hapus"
                          >
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

        {/* Modal */}
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