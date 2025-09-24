import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import SlideFormModal from '../../components/Dashboard/SlideFormModal';
import type { Slide } from '@/types/Slide';
import type { Notification } from '@/types/Notification';

const SlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_SLIDE_ORDER = 3;

  const fetchSlides = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/slides');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error.' }));
        throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
      }
      const data: Slide[] = await response.json();
      setSlides(data.sort((a, b) => a.order - b.order));
    } catch (e: unknown) {
      console.error("Failed to load slides:", e);
      if (e instanceof Error) {
        setError(`Failed to load slide data. Details: ${e.message}`);
      } else {
        setError("Failed to load slide data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAddEdit = (slide: Slide | null = null) => {
    if (!slide && slides.length >= MAX_SLIDE_ORDER) {
      setNotification({ 
        message: `Cannot add more slides. Maximum ${MAX_SLIDE_ORDER} slides allowed. Please edit existing slides.`, 
        type: 'error' 
      });
      return;
    }
    setCurrentSlide(slide);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide? This action cannot be undone!')) {
      try {
        const response = await fetch('/api/slides', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error.' }));
          console.error('Backend Error Response for DELETE:', errorData);
          throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
        }
        await response.json();
        setNotification({ message: 'Slide successfully deleted!', type: 'success' });
        fetchSlides();
      } catch (e: unknown) {
        console.error("Failed to delete slide:", e);
        if (e instanceof Error) {
          setNotification({ message: `Failed to delete slide: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Failed to delete slide. Please try again.', type: 'error' });
        }
      }
    }
  };

  const handleSaveSlide = async (slideToSave: Slide) => {
    try {
      const method = slideToSave.id ? 'PUT' : 'POST';
      const url = '/api/slides';
      const bodyToSend = JSON.stringify(slideToSave);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        if (response.status === 413) {
          errorMessage = "Failed to save slide. Image size too large. Please select a smaller image.";
        }

        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return;
      }

      await response.json();
      setNotification({ message: `Slide successfully ${slideToSave.id ? 'updated' : 'added'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentSlide(null);
      fetchSlides();
    } catch (e: unknown) {
      console.error("Failed to save slide:", e);
      if (e instanceof Error) {
        setNotification({ message: `Failed to save slide: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Failed to save slide. Please try again.', type: 'error' });
      }
    }
  };

  const canAddMoreSlides = slides.length < MAX_SLIDE_ORDER;
  const activeSlides = slides.filter(slide => slide.isActive).length;

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
                  <p className="text-slate-600">Manage images and text displayed in the hero section of the main page</p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-200
                  ${canAddMoreSlides 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                disabled={!canAddMoreSlides}
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
                    <p className="text-sm font-medium text-slate-500">Total Slides</p>
                    <p className="text-2xl font-semibold text-slate-900">{slides.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Slides</p>
                    <p className="text-2xl font-semibold text-emerald-600">{activeSlides}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Available Slots</p>
                    <p className="text-2xl font-semibold text-blue-600">{MAX_SLIDE_ORDER - slides.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Max Capacity</p>
                    <p className="text-2xl font-semibold text-slate-900">{MAX_SLIDE_ORDER}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
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
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                <h3 className="text-lg font-semibold text-slate-900">Slide Records</h3>
                <p className="text-sm text-slate-600 mt-1">Manage hero section slides and content</p>
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
                              <h3 className="text-sm font-medium text-slate-900">No slides found</h3>
                              <p className="text-sm text-slate-500">Get started by creating your first hero slide.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      slides.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">{item.order}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.alt}
                                className="h-14 w-18 rounded-lg object-cover border border-slate-200 shadow-sm"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=72&h=56&q=70';
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
                                ${item.isActive 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-red-100 text-red-800'
                                }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
                              {item.isActive ? 'Active' : 'Inactive'}
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