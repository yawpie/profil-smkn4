"use client";

import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Dashboard/Layout";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import MajorFormModal from "../../components/Dashboard/MajorFormModal";
import type { Major, MajorApi, MajorsApiEnvelope } from "@/types/Major";
import type { Notification } from "@/types/Notification";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  type ApiError,
} from "@/utils/apiClient";
import { useRouter } from "next/router";

const MajorsPage: React.FC = () => {
  const router = useRouter();
  const [majors, setMajors] = useState<Major[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMajor, setCurrentMajor] = useState<Major | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Fungsi untuk mengambil data jurusan dari API
  const fetchMajors = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<MajorsApiEnvelope>(
        `/majors?page=${currentPage}&limit=${itemsPerPage}`
      );
      const apiMajors: MajorApi[] = response.data;
      const mapped: Major[] = apiMajors.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        image: m.image_url || "",
      }));
      setMajors(mapped);

      // Set pagination info from response
      if (response.page) {
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setTotalItems(response.total || 0);
      }
    } catch (e: unknown) {
      console.error("Gagal memuat jurusan:", e);
      if ((e as ApiError)?.message) {
        setError(
          `Gagal memuat data jurusan. Detail: ${(e as ApiError).message}`
        );
      } else if (e instanceof Error) {
        setError(`Gagal memuat data jurusan. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data jurusan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]);

  const handleAddEdit = useCallback((major: Major | null = null) => {
    setCurrentMajor(major);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        confirm(
          "Apakah Anda yakin ingin menghapus jurusan ini? Aksi ini tidak bisa dibatalkan!"
        )
      ) {
        try {
          await apiDelete<{ message: string }>(`/majors?id=${id}`);
          setNotification({
            message: "Jurusan berhasil dihapus!",
            type: "success",
          });
          setCurrentPage(1); // Reset to first page
          fetchMajors();
        } catch (e: unknown) {
          console.error("Gagal menghapus jurusan:", e);
          if ((e as ApiError)?.message) {
            setNotification({
              message: `Gagal menghapus jurusan: ${(e as ApiError).message}`,
              type: "error",
            });
          } else if (e instanceof Error) {
            setNotification({
              message: `Gagal menghapus jurusan: ${e.message}`,
              type: "error",
            });
          } else {
            setNotification({
              message: "Gagal menghapus jurusan. Silakan coba lagi.",
              type: "error",
            });
          }
        }
      }
    },
    [fetchMajors]
  );

  const handleSaveMajor = useCallback(
    async (newMajor: Major) => {
      try {
        const form = new FormData();
        form.append("name", newMajor.name);
        form.append("description", newMajor.description);
        if (newMajor.imageFile) {
          form.append("image", newMajor.imageFile);
        }

        if (newMajor.id) {
          await apiPut<MajorsApiEnvelope>(`/majors?id=${newMajor.id}`, form);
        } else {
          await apiPost<MajorsApiEnvelope>(`/majors`, form);
        }

        setNotification({
          message: `Jurusan berhasil ${
            newMajor.id ? "diperbarui" : "ditambahkan"
          }!`,
          type: "success",
        });
        setIsModalOpen(false);
        setCurrentMajor(null);
        setCurrentPage(1); // Reset to first page
        fetchMajors();
      } catch (e: unknown) {
        console.error("Gagal menyimpan jurusan:", e);
        if ((e as ApiError)?.message) {
          setNotification({
            message: `Gagal menyimpan jurusan: ${(e as ApiError).message}`,
            type: "error",
          });
        } else if (e instanceof Error) {
          setNotification({
            message: `Gagal menyimpan jurusan: ${e.message}`,
            type: "error",
          });
        } else {
          setNotification({
            message: "Gagal menyimpan jurusan. Silakan coba lagi.",
            type: "error",
          });
        }
      }
    },
    [fetchMajors]
  );

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <BookOpenIcon className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Manajemen Jurusan
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Kelola daftar jurusan dan program studi yang tersedia
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Jurusan
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="text-gray-600 font-medium">
                    Memuat data jurusan...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="p-4 bg-red-100 rounded-full inline-block mb-4">
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-lg mb-2">
                    Terjadi Kesalahan
                  </p>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Jurusan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {majors.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <BookOpenIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg">
                                Belum ada jurusan
                              </p>
                              <p className="text-gray-500 mt-1">
                                Mulai dengan menambahkan jurusan pertama Anda
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddEdit()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Tambah Jurusan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      majors.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ID: {item.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.image ? (
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                  onError={(
                                    e: React.SyntheticEvent<
                                      HTMLImageElement,
                                      Event
                                    >
                                  ) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src =
                                      "https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=64&h=64&q=70";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                                <BookOpenIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p
                              className="text-sm text-gray-700 max-w-md"
                              title={item.description}
                            >
                              {item.description}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  router.push(`/dashboard/majors/${item.id}`)
                                }
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                                title="Kelola Galeri & Guru"
                              >
                                <Cog6ToothIcon className="h-4 w-4" />
                              </button>
                              {/* <button
                                onClick={() => handleAddEdit(item)}
                                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                                title="Edit Jurusan"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button> */}
                              <button
                                onClick={() => handleDelete(item.id!)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                                title="Hapus Jurusan"
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      {/* Pagination Info */}
                      <div className="text-sm text-gray-700">
                        Menampilkan{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        hingga{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>{" "}
                        dari <span className="font-medium">{totalItems}</span>{" "}
                        hasil
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Sebelumnya
                        </button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex items-center space-x-1">
                          {(() => {
                            const pages = [];
                            const maxVisible = 7;

                            if (totalPages <= maxVisible) {
                              for (let i = 1; i <= totalPages; i++) {
                                pages.push(i);
                              }
                            } else {
                              pages.push(1);
                              let start = Math.max(2, currentPage - 1);
                              let end = Math.min(
                                totalPages - 1,
                                currentPage + 1
                              );

                              if (currentPage <= 3) {
                                end = 5;
                              }
                              if (currentPage >= totalPages - 2) {
                                start = totalPages - 4;
                              }

                              if (start > 2) {
                                pages.push(-1);
                              }
                              for (let i = start; i <= end; i++) {
                                pages.push(i);
                              }
                              if (end < totalPages - 1) {
                                pages.push(-2);
                              }
                              pages.push(totalPages);
                            }

                            return pages.map((page, index) => {
                              if (page < 0) {
                                return (
                                  <span
                                    key={`ellipsis-${index}`}
                                    className="px-3 py-2 text-gray-500"
                                  >
                                    ...
                                  </span>
                                );
                              }
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                                    currentPage === page
                                      ? "bg-blue-600 text-white shadow-sm"
                                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            });
                          })()}
                        </div>

                        {/* Mobile Page Indicator */}
                        <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                          {currentPage} / {totalPages}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                        >
                          Selanjutnya
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MajorFormModal
          major={currentMajor}
          onSave={handleSaveMajor}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default MajorsPage;
