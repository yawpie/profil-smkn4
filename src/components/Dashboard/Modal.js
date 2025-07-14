// src/components/Modal.js
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Konfirmasi", cancelText = "Batal" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-8 text-lg">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold shadow-md"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;