"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Dashboard/Layout";
import {
  ArrowLeftIcon,
  PhotoIcon,
  UserGroupIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type {
  Major,
  MajorApiResponse,
  MajorGalleryImages,
  MajorsApiEnvelope,
} from "@/types/Major";
import type { Notification } from "@/types/Notification";
import {
  apiGet,
  apiPost,
  apiDelete,
  type ApiError,
  apiPut,
} from "@/utils/apiClient";
import Image from "next/image";
import Link from "next/link";
import { Teacher, TeacherApi, TeachersApiEnvelope } from "@/types/Teacher";
import { img } from "framer-motion/m";
import { PencilIcon } from "lucide-react";
import { handleDeleteTeacher } from "@/utils/handleTeacherChanges";
import { handleNotification } from "@/utils/handleNotification";
import MajorFormModal from "@/components/Dashboard/MajorFormModal";

// type Teacher = {
//   guru_id: string;
//   name: string;
//   jabatan: string;
//   nip: string | null;
//   image_url: string | null;
//   mata_pelajaran: string | null;
// };

// type TeacherOption = {
//   guru_id: string;
//   name: string;
//   jabatan: string;
//   mata_pelajaran: string | null;
//   major_id: string | null;
// };

const MajorDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDeleteImage, setLoadingDeleteImage] = useState<boolean>(false);
  const [loadingDeleteTeacher, setLoadingDeleteTeacher] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Major data
  const [currentMajor, setCurrentMajor] = useState<Major | null>(null);
  const [majorName, setMajorName] = useState<string>("");
  const [majorDescription, setMajorDescription] = useState<string>("");
  const [majorImageCover, setMajorImageCover] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Gallery
  const [galleryImages, setGalleryImages] = useState<MajorGalleryImages[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadForm, setUploadForm] = useState<{
    title: string;
    file: File | null;
    preview: string;
  }>({ title: "", file: null, preview: "" });

  // Teachers
  const [teachers, setTeachers] = useState<TeacherApi[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<TeacherApi[]>([]);
  const [showAddTeacherModal, setShowAddTeacherModal] =
    useState<boolean>(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  // Fetch major details
  const fetchMajorDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<MajorApiResponse>(`/majors?id=${id}`);
      const major = response;
      setCurrentMajor({
        id: major.id,
        description: major.description,
        image: major.image_url || "",
        name: major.name,
      });
      if (major) {
        setMajorName(major.name);
        setMajorDescription(major.description);
        setMajorImageCover(major.image_url);
        setGalleryImages(major.major_gallery_images || []);
        setTeachers(major.guru || []);
      } else {
        setError("Data jurusan tidak ditemukan.");
      }
    } catch (err: unknown) {
      console.error("Error fetching major details:", err);
      if ((err as ApiError)?.message) {
        setError(
          `Terjadi kesalahan saat memuat data: ${(err as ApiError).message}`
        );
      } else {
        setError("Terjadi kesalahan saat memuat data.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch available teachers
  const fetchAvailableTeachers = useCallback(async () => {
    try {
      const response = await apiGet<TeachersApiEnvelope>(`/teachers`);
      setAvailableTeachers(response.data || []);
    } catch (err: unknown) {
      console.error("Error fetching teachers:", err);
    }
  }, []);

  useEffect(() => {
    fetchMajorDetails();
    fetchAvailableTeachers();
    handleNotification(notification, setNotification);
  }, [fetchMajorDetails, fetchAvailableTeachers, notification]);

  // Handle file selection in upload modal
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setNotification({
        message: "Ukuran gambar maksimal 10MB",
        type: "error",
      });
      e.target.value = "";
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadForm({
        title: uploadForm.title || file.name.replace(/\.[^/.]+$/, ""),
        file: file,
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle upload gallery image from modal
  const handleUploadGalleryImage = async () => {
    if (!uploadForm.file || !id) return;

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadForm.file);
      formData.append("major_id", id as string);
      formData.append("title", uploadForm.title.trim() || uploadForm.file.name);

      await apiPost("/majors/add-image", formData);

      setNotification({
        message: "Gambar berhasil ditambahkan ke galeri!",
        type: "success",
      });

      // Reset form and close modal
      setShowUploadModal(false);
      setUploadForm({ title: "", file: null, preview: "" });

      // Refresh data
      fetchMajorDetails();
    } catch (err: unknown) {
      console.error("Error uploading gallery image:", err);
      setNotification({
        message:
          (err as ApiError)?.message ||
          "Gagal mengupload gambar. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  // Handle delete gallery image
  const handleDeleteGalleryImage = async (imageId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;
    setLoadingDeleteImage(true);
    try {
      await apiDelete(`/majors/delete-image?id=${imageId}`);

      setNotification({
        message: "Gambar berhasil dihapus!",
        type: "success",
      });

      // Update local state
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: unknown) {
      console.error("Error deleting gallery image:", err);
      setNotification({
        message:
          (err as ApiError)?.message ||
          "Gagal menghapus gambar. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setLoadingDeleteImage(false);
    }
  };

  // Handle assign teacher
  // const handleAssignTeacher = async () => {
  //   if (!selectedTeacherId || !id) return;

  //   try {
  //     // Update teacher's major_id via PUT /teachers
  //     const formData = new FormData();
  //     formData.append("major_id", id as string);

  //     await apiPost(`/teachers?id=${selectedTeacherId}`, formData);

  //     setNotification({
  //       message: "Guru berhasil ditambahkan ke jurusan!",
  //       type: "success",
  //     });

  //     setShowAddTeacherModal(false);
  //     setSelectedTeacherId("");

  //     // Refresh data
  //     fetchMajorDetails();
  //     fetchAvailableTeachers();
  //   } catch (err: unknown) {
  //     console.error("Error assigning teacher:", err);
  //     setNotification({
  //       message:
  //         (err as ApiError)?.message ||
  //         "Gagal menambahkan guru. Silakan coba lagi.",
  //       type: "error",
  //     });
  //   }
  // };

  // Handle remove teacher from major
  // const handleDeleteTeacher = async (teacherId: string) => {
  //   if (!confirm("Apakah Anda yakin ingin menghapus guru dari jurusan ini?"))
  //     return;

  //   try {
  //     // Set major_id to null
  //     // const formData = new FormData();
  //     // formData.append("major_id", "");

  //     await apiDelete(`/teachers?id=${teacherId}`);

  //     setNotification({
  //       message: "Guru berhasil dihapus dari jurusan!",
  //       type: "success",
  //     });

  //     // Update local state
  //     setTeachers((prev) => prev.filter((t) => t.guru_id !== teacherId));
  //     fetchAvailableTeachers();
  //   } catch (err: unknown) {
  //     console.error("Error removing teacher:", err);
  //     setNotification({
  //       message:
  //         (err as ApiError)?.message ||
  //         "Gagal menghapus guru. Silakan coba lagi.",
  //       type: "error",
  //     });
  //   }
  // };

  const handleEditMajor = async () => {
    setIsModalOpen(true);
  };

  const handleSaveMajor = useCallback(async (newMajor: Major) => {
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
      // setCurrentMajor(null);
      // setCurrentPage(1); // Reset to first page
      // fetchMajors();
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
  }, []);

  if (loading) {
    return (
      <Layout setNotification={setNotification}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="text-gray-600 font-medium">
                  Memuat data jurusan...
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout setNotification={setNotification}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="text-gray-600 mb-4">{error}</p>
                <Link
                  href="/dashboard/majors"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Kembali ke Daftar Jurusan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/dashboard/majors"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {majorName}
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola galeri dan daftar guru jurusan
                </p>
              </div>
              <div className="flex items-end justify-end gap-2 mt-4">
                <button
                  onClick={handleEditMajor}
                  className=" inline-flex  items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Jurusan
                </button>
              </div>
            </div>

            {/* Major Info */}
            {majorImageCover && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                <Image
                  src={majorImageCover}
                  alt={majorName}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            )}
            <p className="text-gray-700 leading-relaxed">{majorDescription}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PhotoIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Galeri Jurusan
                    </h2>
                    <p className="text-sm text-gray-500">
                      {galleryImages.length} gambar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  Tambah Gambar
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-visible">
                {galleryImages.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada gambar di galeri</p>
                  </div>
                ) : !loadingDeleteImage ? (
                  galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200"
                    >
                      {img.image_url ? (
                        <Image
                          src={img.image_url}
                          alt={img.title || "Gallery image"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <PhotoIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      <div className="absolute inset-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 h-full col-span-full">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Teachers Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Guru Jurusan
                    </h2>
                    <p className="text-sm text-gray-500">
                      {teachers.length} guru
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/teachers`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  Tambah Guru
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {teachers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Belum ada guru di jurusan ini
                    </p>
                  </div>
                ) : !loadingDeleteTeacher ? (
                  teachers.map((teacher) => (
                    <div
                      key={teacher.guru_id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-all duration-200"
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        {teacher.image_url ? (
                          <Image
                            src={teacher.image_url}
                            alt={teacher.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {teacher.jabatan}
                        </p>
                        {teacher.mata_pelajaran && (
                          <p className="text-xs text-gray-500">
                            {teacher.mata_pelajaran}
                          </p>
                        )}
                        {teacher.nip && (
                          <p className="text-xs text-gray-500">
                            NIP: {teacher.nip}
                          </p>
                        )}
                      </div>
                      <button
                        // onClick={() => }
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4 " />
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteTeacher(
                            teacher.guru_id,
                            setNotification,
                            setLoadingDeleteTeacher
                          );
                          fetchAvailableTeachers();
                        }}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 h-full col-span-full">
                    <div className="flex items-center justify-center">
                      <div className=" animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Gallery Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tambah Gambar ke Galeri
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Gambar
              </label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan judul gambar"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Gambar
              </label>
              <div className="relative">
                {uploadForm.preview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 mb-3">
                    <Image
                      src={uploadForm.preview}
                      alt="Preview"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      onClick={() =>
                        setUploadForm({
                          ...uploadForm,
                          file: null,
                          preview: "",
                        })
                      }
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PhotoIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span>{" "}
                        atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (Maks. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: "", file: null, preview: "" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={uploadingGallery}
              >
                Batal
              </button>
              <button
                onClick={handleUploadGalleryImage}
                disabled={!uploadForm.file || uploadingGallery}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {uploadingGallery ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {/* {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tambah Guru ke Jurusan
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Guru
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">-- Pilih Guru --</option>
                {availableTeachers
                  .filter((t) => !t.major_id || t.major_id === id)
                  .map((teacher) => (
                    <option key={teacher.guru_id} value={teacher.guru_id}>
                      {teacher.name} - {teacher.jabatan}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddTeacherModal(false);
                  setSelectedTeacherId("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleAssignTeacher}
                disabled={!selectedTeacherId}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Tambahkan
              </button>
            </div>
          </div>
        </div>
      )} */}
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

export default MajorDetailPage;
