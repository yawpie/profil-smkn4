// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}', // If using Next.js 13+ app directory
    ],
    theme: {
      extend: {
        colors: {
          // Aesthetic blue, indigo, purple, sky, cyan, and other tones for aesthetic gradients
          'blue-50': '#EFF6FF',
          'blue-100': '#DBEAFE',
          'blue-200': '#BFDBFE',
          'blue-300': '#93C5FD',
          'blue-400': '#60A5FA',
          'blue-500': '#3B82F6', // Lighter shade for gradients
          'blue-600': '#2563EB',
          'blue-700': '#1D4ED8',
          'blue-800': '#1E40AF', // Darker shade for gradients
          'blue-900': '#1E3A8A',
          'indigo-50': '#EEF2FF',
          'indigo-100': '#E0E7FF',
          'indigo-200': '#C7D2FE',
          'indigo-300': '#A5B4FC',
          'indigo-400': '#818CF8',
          'indigo-500': '#6366F1',
          'indigo-600': '#4F46E5',
          'indigo-700': '#4338CA',
          'indigo-800': '#3730A3', // Darker shade for gradients
          'indigo-900': '#312E81',
          'purple-50': '#FAF5FF',
          'purple-100': '#F3E8FF',
          'purple-200': '#E9D5FF',
          'purple-300': '#D8B4FE',
          'purple-400': '#C084FC',
          'purple-500': '#A855F7', // Lighter shade for gradients
          'purple-700': '#6B21A8',
          'sky-50': '#F0F9FF',
          'sky-100': '#E0F2FE',
          'sky-200': '#BAE6FD',
          'sky-300': '#7DD3FC',
          'cyan-50': '#ECFEFF',
          'cyan-100': '#CFFAFE',
          'cyan-200': '#A5F3FC',
          'cyan-300': '#67E8F9',
          'teal-500': '#14B8A6',
          'teal-800': '#0F766E', // Darker shade for gradients
          'rose-500': '#F43F5E', // New: For a statistic card
          'green-500': '#22C55E', // New: For a statistic card
        },
        keyframes: {
          'gradient-xy': {
            '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
            '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
          },
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          },
          'blob-pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          'fade-in-down': {
            '0%': { opacity: '0', transform: 'translateY(-20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          'morph-in': {
            '0%': { opacity: '0', transform: 'scale(0.9) translateY(40px)', filter: 'blur(10px)' },
            '100%': { opacity: '1', transform: 'scale(1) translateY(0)', filter: 'blur(0)' },
          },
          'pulse-slow': {
            '0%, 100%': { opacity: '0.8' },
            '50%': { opacity: '0.5' },
          }
        },
        animation: {
          'gradient-xy': 'gradient-xy 15s ease infinite',
          blob: 'blob 7s infinite cubic-bezier(0.6, 0.0, 0.4, 1.0)',
          'blob-pulse': 'blob-pulse 3s infinite ease-in-out',
          'fade-in': 'fade-in 0.8s ease-out forwards',
          'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
          'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
          'morph-in': 'morph-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [],
  }