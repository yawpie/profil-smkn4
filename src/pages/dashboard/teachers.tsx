"use client";

import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Dashboard/Layout";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import TeacherFormModal from "../../components/Dashboard/TeacherFormModal";
import type { Teacher, TeacherApi, TeachersApiEnvelope } from "@/types/Teacher";
import type { Notification } from "@/types/Notification";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  type ApiError,
} from "@/utils/apiClient";

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Function to fetch teacher data from the API
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<TeachersApiEnvelope>(
        `/teachers?page=${currentPage}&limit=${itemsPerPage}`
      );
      const apiItems: TeacherApi[] = res.data ?? [];
      const normalized: Teacher[] = apiItems.map((t) => ({
        id: t.guru_id,
        name: t.name,
        image: t.image_url ?? "",
        subject: t.jabatan, // temporary mapping; adjust if subject becomes separate
        nip: t.nip,
        position: t.jabatan,
      }));
      setTeachers(normalized);

      // Set pagination info from response
      if (res.page) {
        setTotalPages(Math.ceil(res.total / itemsPerPage));
        setTotalItems(res.total || 0);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch teachers:", e);
      if ((e as ApiError)?.message) {
        setError(`Gagal memuat data guru. Detail: ${(e as ApiError).message}`);
      } else if (e instanceof Error) {
        setError(`Gagal memuat data guru. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data guru. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAddEdit = (teacher: Teacher | null = null) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      try {
        await apiDelete<{ message: string }>(`/teacher?id=${id}`);
        setNotification({
          message: "Data guru berhasil dihapus!",
          type: "success",
        });
        setCurrentPage(1); // Reset to first page
        fetchTeachers();
      } catch (e: unknown) {
        console.error("Failed to delete teacher:", e);
        if ((e as ApiError)?.message) {
          setNotification({
            message: `Gagal menghapus guru: ${(e as ApiError).message}`,
            type: "error",
          });
        } else if (e instanceof Error) {
          setNotification({
            message: `Gagal menghapus guru: ${e.message}`,
            type: "error",
          });
        } else {
          setNotification({
            message: "Gagal menghapus guru. Silakan coba lagi.",
            type: "error",
          });
        }
      }
    }
  };

  const handleSaveTeacher = async (newTeacher: Teacher) => {
    try {
      const formData = new FormData();
      formData.append("name", newTeacher.name);
      // Backend expects 'jabatan' for position
      formData.append("jabatan", newTeacher.position);
      if (newTeacher.nip) {
        formData.append("nip", newTeacher.nip);
      }
      if (newTeacher.imageFile) {
        formData.append("image", newTeacher.imageFile);
      }

      // If subject is distinct from jabatan and backend supports it, you could
      // append it as an extra field here. For now, subject is mapped from jabatan.

      // Image handling: if the form has set an image as a File in a future
      // enhancement, it should be appended here. Currently Teacher only
      // exposes image as string URL/base64, so we only send image when it
      // represents a File in the calling code.

      if (newTeacher.id) {
        await apiPut<TeachersApiEnvelope, FormData>(
          `/teachers?id=${newTeacher.id}`,
          formData
        );
      } else {
        await apiPost<TeachersApiEnvelope, FormData>("/teachers", formData);
      }
      setNotification({
        message: `Data guru berhasil ${
          newTeacher.id ? "diperbarui" : "ditambahkan"
        }!`,
        type: "success",
      });
      setIsModalOpen(false);
      setCurrentTeacher(null);
      setCurrentPage(1); // Reset to first page
      fetchTeachers();
    } catch (e: unknown) {
      console.error("Failed to save teacher:", e);
      if ((e as ApiError)?.status === 413) {
        setNotification({
          message:
            "Gagal menyimpan guru. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.",
          type: "error",
        });
      } else if ((e as ApiError)?.message) {
        setNotification({
          message: `Gagal menyimpan guru: ${(e as ApiError).message}`,
          type: "error",
        });
      } else if (e instanceof Error) {
        setNotification({
          message: `Gagal menyimpan guru: ${e.message}`,
          type: "error",
        });
      } else {
        setNotification({
          message: "Gagal menyimpan guru. Silakan coba lagi.",
          type: "error",
        });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  Manajemen Guru
                </h1>
                <p className="text-slate-600 text-lg">
                  Kelola data tenaga pengajar dengan sistem yang terintegrasi
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAddEdit()}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              Tambah Guru Baru
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                    Total Guru
                  </p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">
                    {teachers.length}
                  </p>
                </div>
                <UserGroupIcon className="h-12 w-12 text-blue-500 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">
                    Mata Pelajaran
                  </p>
                  <p className="text-3xl font-bold text-emerald-800 mt-1">
                    {new Set(teachers.map((t) => t.subject)).size}
                  </p>
                </div>
                <AcademicCapIcon className="h-12 w-12 text-emerald-500 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 font-semibold text-sm uppercase tracking-wide">
                    Status Aktif
                  </p>
                  <p className="text-3xl font-bold text-amber-800 mt-1">
                    {teachers.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium">
                Memuat data guru...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-red-50 rounded-full mb-4">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : (
            <>
              {teachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="p-6 bg-slate-50 rounded-full mb-6">
                    <AcademicCapIcon className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Belum Ada Data Guru
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Mulai dengan menambahkan guru pertama ke dalam sistem
                  </p>
                  <button
                    onClick={() => handleAddEdit()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Tambah Guru Pertama
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Informasi Guru
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Mata Pelajaran
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          NIP
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Jabatan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {teachers.map((teacher, index) => (
                        <tr
                          key={teacher.id}
                          className="hover:bg-slate-50 transition-colors duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {teacher.image ? (
                                  <img
                                    src={teacher.image}
                                    alt={teacher.name}
                                    className="h-12 w-12 rounded-xl object-cover border-2 border-slate-200 shadow-sm"
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
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border-2 border-slate-200">
                                    <AcademicCapIcon className="h-6 w-6 text-slate-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-slate-900">
                                  {teacher.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                  Tenaga Pengajar
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {teacher.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">
                            {teacher.nip}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                            {teacher.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                              Aktif
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAddEdit(teacher)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200"
                                title="Edit Data Guru"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(teacher.id!)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 border border-red-200"
                                title="Hapus Data Guru"
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
        <TeacherFormModal
          teacher={currentTeacher}
          onSave={handleSaveTeacher}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default TeachersPage;
