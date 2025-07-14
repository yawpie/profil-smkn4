// src/components/Dashboard/Notification.js
import { X, AlertCircle } from "lucide-react";

const Notification = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <AlertCircle className="h-6 w-6 mr-2" />
  );

  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl flex items-center z-50 animate-fade-in-down`}>
      {icon}
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4 text-white opacity-75 hover:opacity-100 transition-opacity">
        <X size={20} />
      </button>
    </div>
  );
};

export default Notification;