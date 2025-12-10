"use client";
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Dashboard/Layout";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import FacilityFormModal from "../../components/Dashboard/FacilityFormModal";
import type {
  Facility,
  FacilityApi,
  FacilitiesApiEnvelope,
} from "@/types/Facility";
import type { Notification } from "@/types/Notification";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  type ApiError,
} from "@/utils/apiClient";

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentFacility, setCurrentFacility] = useState<Facility | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Function to fetch facilities data from the API
  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<FacilitiesApiEnvelope>(
        `/facilities?page=${currentPage}&limit=${itemsPerPage}`
      );
      const apiItems: FacilityApi[] = res.data ?? [];
      const normalized: Facility[] = apiItems.map((f) => ({
        id: f.id,
        name: f.name,
        image: f.image_url ?? "",
        description: f.description ?? "",
        location: f.location ?? "",
        status:
          f.status === "TERSEDIA"
            ? "Tersedia"
            : f.status === "DIGUNAKAN"
            ? "Digunakan"
            : f.status === "PERBAIKAN"
            ? "Perbaikan"
            : "Tidak Tersedia",
      }));
      setFacilities(normalized);

      // Set pagination info from response
      if (res.page) {
        setTotalPages(Math.ceil(res.total / itemsPerPage));
        setTotalItems(res.total || 0);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch facilities:", e);
      if ((e as ApiError)?.message) {
        setError(
          `Gagal memuat data fasilitas. Detail: ${(e as ApiError).message}`
        );
      } else if (e instanceof Error) {
        setError(`Gagal memuat data fasilitas. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data fasilitas. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleAddEdit = (facility: Facility | null = null) => {
    setCurrentFacility(facility);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | null) => {
    if (confirm("Apakah Anda yakin ingin menghapus fasilitas ini?")) {
      try {
        if (!id) {
          throw new Error("ID fasilitas tidak valid.");
        }
        await apiDelete<{ message: string }>(`/facilities?id=${id}`);
        setNotification({
          message: "Fasilitas berhasil dihapus!",
          type: "success",
        });
        setCurrentPage(1); // Reset to first page
        fetchFacilities();
      } catch (e: unknown) {
        console.error("Gagal menghapus fasilitas:", e);
        if ((e as ApiError)?.message) {
          setNotification({
            message: `Gagal menghapus fasilitas: ${(e as ApiError).message}`,
            type: "error",
          });
        } else if (e instanceof Error) {
          setNotification({
            message: `Gagal menghapus fasilitas: ${e.message}`,
            type: "error",
          });
        } else {
          setNotification({
            message: "Gagal menghapus fasilitas. Silakan coba lagi.",
            type: "error",
          });
        }
      }
    }
  };

  const handleSaveFacility = async (newFacility: Facility) => {
    try {
      const formData = new FormData();
      formData.append("name", newFacility.name);
      if (newFacility.description) {
        formData.append("description", newFacility.description);
      }
      if (newFacility.location) {
        formData.append("location", newFacility.location);
      }
      // Map localized status back to backend enum
      const backendStatus =
        newFacility.status === "Tersedia"
          ? "TERSEDIA"
          : newFacility.status === "Digunakan"
          ? "DIGUNAKAN"
          : newFacility.status === "Perbaikan"
          ? "PERBAIKAN"
          : "TIDAK_TERSEDIA";
      formData.append("status", backendStatus);

      // Note: To upload image files, FacilityFormModal would need to
      // provide a File; this currently only has image URL.

      if (newFacility.id) {
        await apiPut<FacilitiesApiEnvelope, FormData>(
          `/facilities?id=${newFacility.id}`,
          formData
        );
      } else {
        await apiPost<FacilitiesApiEnvelope, FormData>("/facilities", formData);
      }
      setNotification({
        message: `Fasilitas berhasil ${
          newFacility.id ? "diperbarui" : "ditambahkan"
        }!`,
        type: "success",
      });
      setIsModalOpen(false);
      setCurrentFacility(null);
      setCurrentPage(1); // Reset to first page
      fetchFacilities();
    } catch (e: unknown) {
      console.error("Gagal menyimpan fasilitas:", e);
      if ((e as ApiError)?.status === 413) {
        setNotification({
          message:
            "Gagal menyimpan fasilitas. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.",
          type: "error",
        });
      } else if ((e as ApiError)?.message) {
        setNotification({
          message: `Gagal menyimpan fasilitas: ${(e as ApiError).message}`,
          type: "error",
        });
      } else if (e instanceof Error) {
        setNotification({
          message: `Gagal menyimpan fasilitas: ${e.message}`,
          type: "error",
        });
      } else {
        setNotification({
          message: "Gagal menyimpan fasilitas. Silakan coba lagi.",
          type: "error",
        });
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
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Manajemen Fasilitas
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Kelola dan pantau semua fasilitas institusi
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Fasilitas
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="text-gray-600 font-medium">
                    Memuat data fasilitas...
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
                        Fasilitas
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facilities.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg">
                                Belum ada fasilitas
                              </p>
                              <p className="text-gray-500 mt-1">
                                Mulai dengan menambahkan fasilitas pertama Anda
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddEdit()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Tambah Fasilitas
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      facilities.map((item, index) => (
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
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p
                              className="text-sm text-gray-700 max-w-xs truncate"
                              title={item.description}
                            >
                              {item.description}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 font-medium">
                              {item.location}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === "Tersedia"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : item.status === "Digunakan"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  item.status === "Tersedia"
                                    ? "bg-emerald-500"
                                    : item.status === "Digunakan"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAddEdit(item)}
                                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200"
                                title="Edit Fasilitas"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                                title="Hapus Fasilitas"
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
        <FacilityFormModal
          facility={currentFacility}
          onSave={handleSaveFacility}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default FacilitiesPage;
