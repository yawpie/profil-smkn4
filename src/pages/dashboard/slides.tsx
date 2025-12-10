"use client";
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Dashboard/Layout";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import SlideFormModal from "../../components/Dashboard/SlideFormModal";
import type { Slide, SlidesApiEnvelope } from "@/types/Slide";
import type { Notification } from "@/types/Notification";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  type ApiError,
} from "@/utils/apiClient";

const SlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  const MAX_SLIDE_ORDER = 3;

  const fetchSlides = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ message: string; data: Slide[] }>(
        `/slides?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = res.data;
      setSlides(data.sort((a, b) => a.order - b.order));

      // For slides, we don't have pagination info in response yet
      // Just set reasonable defaults
      setTotalPages(1);
      setTotalItems(data.length);
    } catch (e: unknown) {
      console.error("Failed to load slides:", e);
      const apiError = e as ApiError;
      if (apiError?.message) {
        setError(`Failed to load slide data. Details: ${apiError.message}`);
      } else if (e instanceof Error) {
        setError(`Failed to load slide data. Details: ${e.message}`);
      } else {
        setError("Failed to load slide data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleAddEdit = (slide: Slide | null = null) => {
    if (!slide && slides.length >= MAX_SLIDE_ORDER) {
      setNotification({
        message: `Cannot add more slides. Maximum ${MAX_SLIDE_ORDER} slides allowed. Please edit existing slides.`,
        type: "error",
      });
      return;
    }
    setCurrentSlide(slide);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this slide? This action cannot be undone!"
      )
    ) {
      try {
        await apiDelete<{ message: string }>(`/slides?id=${id}`);
        setNotification({
          message: "Slide successfully deleted!",
          type: "success",
        });
        setCurrentPage(1); // Reset to first page
        fetchSlides();
      } catch (e: unknown) {
        console.error("Failed to delete slide:", e);
        const apiError = e as ApiError;
        const message =
          apiError?.message ||
          (e instanceof Error
            ? e.message
            : "Failed to delete slide. Please try again.");
        setNotification({
          message: `Failed to delete slide: ${message}`,
          type: "error",
        });
      }
    }
  };

  const handleSaveSlide = async (slideToSave: Slide) => {
    try {
      const formData = new FormData();
      if (slideToSave.imageFile) {
        formData.append("image", slideToSave.imageFile);
      }
      formData.append("alt", slideToSave.alt);
      formData.append("title", slideToSave.title);
      formData.append("subtitle", slideToSave.subtitle);
      formData.append("description", slideToSave.description);
      // gradientFrom: 'from-blue-900',
      //   gradientTo: 'to-blue-500',
      formData.append("gradientFrom", "from-blue-900");
      formData.append("gradientTo", "to-blue-500");
      formData.append("order", String(slideToSave.order));
      formData.append("isActive", String(slideToSave.isActive));

      if (slideToSave.id) {
        await apiPut<SlidesApiEnvelope, FormData>(
          `/slides/${slideToSave.id}`,
          formData
        );
      } else {
        // console.log(Array.from(formData.entries()));
        await apiPost<SlidesApiEnvelope, FormData>("/slides", formData);
      }
      setNotification({
        message: `Slide successfully ${slideToSave.id ? "updated" : "added"}!`,
        type: "success",
      });
      setIsModalOpen(false);
      setCurrentSlide(null);
      setCurrentPage(1); // Reset to first page
      fetchSlides();
    } catch (e: unknown) {
      console.error("Failed to save slide:", e);
      const apiError = e as ApiError;
      const message =
        apiError?.message ||
        (e instanceof Error
          ? e.message
          : "Failed to save slide. Please try again.");
      setNotification({
        message: `Failed to save slide: ${message}`,
        type: "error",
      });
    }
  };

  // const canAddMoreSlides = slides.length < MAX_SLIDE_ORDER;
  const activeSlides = slides.filter((slide) => slide.isActive).length;

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 mb-1">
                    Hero Slide Management
                  </h1>
                  <p className="text-slate-600">
                    Manage images and text displayed in the hero section of the
                    main page
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-200
                  ${
                    // canAddMoreSlides
                    // ?
                    "bg-slate-900 hover:bg-slate-800 text-white"
                    // : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                // disabled={!canAddMoreSlides}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Slide
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Slides
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      {slides.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Active Slides
                    </p>
                    <p className="text-2xl font-semibold text-emerald-600">
                      {activeSlides}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Available Slots
                    </p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {MAX_SLIDE_ORDER - slides.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Max Capacity
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      {MAX_SLIDE_ORDER}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                <span className="text-slate-600">Loading slide data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">
                  Slide Records
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Manage hero section slides and content
                </p>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Subtitle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {slides.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-slate-100 mx-auto rounded-lg flex items-center justify-center">
                              <PhotoIcon className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-slate-900">
                                No slides found
                              </h3>
                              <p className="text-sm text-slate-500">
                                Get started by creating your first hero slide.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      slides.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                  {item.order}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.alt}
                                className="h-14 w-18 rounded-lg object-cover border border-slate-200 shadow-sm"
                                onError={(
                                  e: React.SyntheticEvent<
                                    HTMLImageElement,
                                    Event
                                  >
                                ) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src =
                                    "https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=72&h=56&q=70";
                                }}
                              />
                            ) : (
                              <div className="h-14 w-18 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <PhotoIcon className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900 line-clamp-2 max-w-xs">
                              {item.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-700 line-clamp-2 max-w-xs">
                              {item.subtitle}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${
                                  item.isActive
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  item.isActive
                                    ? "bg-emerald-600"
                                    : "bg-red-600"
                                }`}
                              />
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1">
                              <button
                                onClick={() => handleAddEdit(item)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                title="Edit Slide"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                title="Delete Slide"
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
            </div>
          )}

          {isModalOpen && (
            <SlideFormModal
              slide={currentSlide}
              onSave={handleSaveSlide}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SlidesPage;
