"use client";

import React, { useState, useEffect, useCallback, FC } from "react";
import Layout from "../../components/Dashboard/Layout";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AchievementFormModal from "@/components/Dashboard/AchievementFormModal";
import type {
  Achievement,
  AchievementApi,
  AchievementsApiEnvelope,
} from "@/types/Achievement";
import type { Notification } from "@/types/Notification";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  type ApiError,
} from "@/utils/apiClient";
import { DashboardTotals } from "@/types/DashboardTotals";

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return "Invalid Date";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

const AchievementsPage: FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;
  const [achievementLength, setAchievementLength] = useState<number>(0);

  // let totalAchievementsLocalStorage: number = 0;

  // Function to fetch achievements data from API
  const fetchAchievements = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<AchievementsApiEnvelope>(
        `/achievements?page=${currentPage}&limit=${itemsPerPage}`
      );
      const apiList: AchievementApi[] = response.data;

      const data: Achievement[] = apiList.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image_url || "/images/placeholder-achievement.png",
        publishDate: item.publishDate
          ? new Date(item.publishDate).toISOString()
          : "",
        content: item.content,
      }));
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return dateB - dateA;
      });
      setAchievements(sortedData);
      const getStatsTotal = localStorage.getItem("statsTotals") || "{}";
      const statsTotalsJson: DashboardTotals = JSON.parse(getStatsTotal);
      setAchievementLength(statsTotalsJson.achievements || 0);

      // Set pagination info from response
      if (response.page) {
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setTotalItems(response.total || 0);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch achievements:", e);
      if ((e as ApiError)?.message) {
        setError(
          `Failed to load achievements. Details: ${(e as ApiError).message}`
        );
      } else if (e instanceof Error) {
        setError(`Failed to load achievements. Details: ${e.message}`);
      } else {
        setError("Failed to load achievements. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleAddEdit = (achievement: Achievement | null = null) => {
    setCurrentAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      try {
        await apiDelete<{ message: string }>(`/achievements/${id}`);

        setNotification({
          message: "Achievement successfully deleted!",
          type: "success",
        });
        fetchAchievements();
      } catch (e: unknown) {
        console.error("Failed to delete achievement:", e);
        if ((e as ApiError)?.message) {
          setNotification({
            message: `Failed to delete achievement: ${(e as ApiError).message}`,
            type: "error",
          });
        } else if (e instanceof Error) {
          setNotification({
            message: `Failed to delete achievement: ${e.message}`,
            type: "error",
          });
        } else {
          setNotification({
            message: "Failed to delete achievement. Please try again.",
            type: "error",
          });
        }
      }
    }
  };

  const handleSaveAchievement = async (
    newAchievement: Achievement,
    imageFile: File | null
  ) => {
    try {
      const form = new FormData();
      form.append("title", newAchievement.title);
      form.append("description", newAchievement.description);
      form.append("content", newAchievement.content);
      // Ensure UTC ISO for consistency (backend can parse ISO strings)
      form.append(
        "publishDate",
        new Date(newAchievement.publishDate).toISOString()
      );
      if (imageFile) {
        form.append("image", imageFile);
      }

      if (newAchievement.id) {
        await apiPut<{ message: string; data: AchievementApi }>(
          `/achievements/${newAchievement.id}`,
          form
        );
      } else {
        await apiPost<{ message: string; data: AchievementApi }>(
          `/achievements`,
          form
        );
      }

      setNotification({
        message: `Achievement successfully ${
          newAchievement.id ? "updated" : "added"
        }!`,
        type: "success",
      });
      setIsModalOpen(false);
      setCurrentAchievement(null);
      setCurrentPage(1); // Reset to first page after adding/editing
      fetchAchievements();
    } catch (e: unknown) {
      console.error("Failed to save achievement:", e);
      if ((e as ApiError)?.message) {
        setNotification({
          message: `Failed to save achievement: ${(e as ApiError).message}`,
          type: "error",
        });
      } else if (e instanceof Error) {
        setNotification({
          message: `Failed to save achievement: ${e.message}`,
          type: "error",
        });
      } else {
        setNotification({
          message: "Failed to save achievement. Please try again.",
          type: "error",
        });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  Achievement Management
                </h1>
                <p className="text-gray-600">
                  Manage institutional achievements and milestones
                </p>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Achievement
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Achievements
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {achievementLength}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      This Month
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {
                        achievements.filter((a) => {
                          const date = new Date(a.publishDate);
                          const now = new Date();
                          return (
                            date.getMonth() === now.getMonth() &&
                            date.getFullYear() === now.getFullYear()
                          );
                        }).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Latest Entry
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {achievementLength > 0
                        ? formatDate(achievements[0].publishDate)
                        : "No data"}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading achievements...</span>
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
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Achievement Records
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and organize institutional achievements
                </p>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Achievement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Published
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {achievements.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-gray-100 mx-auto rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                No achievements found
                              </h3>
                              <p className="text-sm text-gray-500">
                                Get started by creating your first achievement.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      achievements.map((item) => (
                        <>
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.title}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                                />
                              ) : (
                                <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {formatDate(item.publishDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="inline-flex space-x-2">
                                <button
                                  onClick={() => handleAddEdit(item)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                  title="Edit Achievement"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                  title="Delete Achievement"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    {/* Pagination Info */}
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>{" "}
                      of <span className="font-medium">{totalItems}</span>{" "}
                      results
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
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center space-x-1">
                        {(() => {
                          const pages = [];
                          const maxVisible = 7;

                          if (totalPages <= maxVisible) {
                            // Show all pages if total is less than max
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(i);
                            }
                          } else {
                            // Show first page
                            pages.push(1);

                            // Calculate range around current page
                            let start = Math.max(2, currentPage - 1);
                            let end = Math.min(totalPages - 1, currentPage + 1);

                            // Adjust if current page is near start
                            if (currentPage <= 3) {
                              end = 5;
                            }

                            // Adjust if current page is near end
                            if (currentPage >= totalPages - 2) {
                              start = totalPages - 4;
                            }

                            // Add ellipsis after first page if needed
                            if (start > 2) {
                              pages.push(-1); // -1 represents ellipsis
                            }

                            // Add middle pages
                            for (let i = start; i <= end; i++) {
                              pages.push(i);
                            }

                            // Add ellipsis before last page if needed
                            if (end < totalPages - 1) {
                              pages.push(-2); // -2 represents ellipsis
                            }

                            // Show last page
                            pages.push(totalPages);
                          }

                          return pages.map((page, index) => {
                            if (page < 0) {
                              // Render ellipsis
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
                        Next
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

          {isModalOpen && (
            <AchievementFormModal
              achievement={currentAchievement}
              onSave={handleSaveAchievement}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AchievementsPage;
