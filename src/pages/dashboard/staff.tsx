"use client";

import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Dashboard/Layout";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import StaffFormModal from "../../components/Dashboard/StaffFormModal";
import type { Staff } from "@/types/Staff";
import type { Notification } from "@/types/Notification";

const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;
  // Function to fetch staff data from the API
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/staff?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Kesalahan tidak diketahui dari server." }));
        const errorMessage = `HTTP error! Status: ${response.status}: ${
          errorData.message || response.statusText
        }`;
        setNotification({ message: errorMessage, type: "error" });
        throw new Error(errorMessage);
      }
      const data: Staff[] = await response.json();
      setStaffList(data);

      // For now, set reasonable pagination defaults
      // The API can be updated to return page/total info
      setTotalPages(1);
      setTotalItems(data.length);
    } catch (e: unknown) {
      console.error("Failed to fetch staff:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data staff. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data staff. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddEdit = (staff: Staff | null = null) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data staff ini?")) {
      try {
        const response = await fetch(`/api/staff?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Kesalahan tidak diketahui." }));
          const errorMessage = `HTTP error! Status: ${response.status}: ${
            errorData.message || response.statusText
          }`;
          setNotification({ message: errorMessage, type: "error" });
          console.error("Backend Error Response for DELETE:", errorData);
          return;
        }
        await response.json();
        setNotification({
          message: "Data staff berhasil dihapus!",
          type: "success",
        });
        setCurrentPage(1); // Reset to first page
        fetchStaff();
      } catch (e: unknown) {
        console.error("Failed to delete staff:", e);
        if (e instanceof Error) {
          setNotification({
            message: `Gagal menghapus staff: ${e.message}`,
            type: "error",
          });
        } else {
          setNotification({
            message: "Gagal menghapus staff. Silakan coba lagi.",
            type: "error",
          });
        }
      }
    }
  };

  const handleSaveStaff = async (newStaff: Staff) => {
    try {
      const method = newStaff.id ? "PUT" : "POST";
      const response = await fetch("/api/staff", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStaff),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Kesalahan tidak diketahui." }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${
          errorData.message || response.statusText
        }`;

        if (response.status === 413) {
          errorMessage =
            "Gagal menyimpan staff. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }

        setNotification({ message: errorMessage, type: "error" });
        console.error("Backend Error Response for SAVE:", errorData);
        return;
      }
      await response.json();
      setNotification({
        message: `Data staff berhasil ${
          newStaff.id ? "diperbarui" : "ditambahkan"
        }!`,
        type: "success",
      });
      setIsModalOpen(false);
      setCurrentStaff(null);
      setCurrentPage(1); // Reset to first page
      fetchStaff();
    } catch (e: unknown) {
      console.error("Failed to save staff:", e);
      if (e instanceof Error) {
        setNotification({
          message: `Gagal menyimpan staff: ${e.message}`,
          type: "error",
        });
      } else {
        setNotification({
          message: "Gagal menyimpan staff. Silakan coba lagi.",
          type: "error",
        });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manajemen Staff
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola data tenaga administrasi sekolah
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-teal-50 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-teal-900">
                    Total: {staffList.length} Staff
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Tambah Staff
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600 text-sm">Memuat data staff...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              {staffList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <BriefcaseIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada data staff
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Mulai dengan menambahkan staff pertama
                  </p>
                  <button
                    onClick={() => handleAddEdit()}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tambah Staff Pertama
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jabatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NIP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffList.map((staff, index) => (
                        <tr
                          key={staff.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {staff.image ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                    src={staff.image}
                                    alt={staff.name}
                                    onError={(
                                      e: React.SyntheticEvent<
                                        HTMLImageElement,
                                        Event
                                      >
                                    ) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.src =
                                        "https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=48&h=48&q=70";
                                    }}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {staff.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Tenaga Administrasi
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              {staff.position}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {staff.nip}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                              Aktif
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleAddEdit(staff)}
                                className="inline-flex items-center p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-150"
                                title="Edit staff"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(staff.id!)}
                                className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                title="Hapus staff"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StaffFormModal
          staff={currentStaff}
          onSave={handleSaveStaff}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default StaffPage;
