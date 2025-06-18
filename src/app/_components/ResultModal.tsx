import React from "react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    color: string;
    member: string;
    text: string;
    image: string;
  };
}

export default function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <img 
              src={result.image} 
              alt={result.member}
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {result.member}
          </h2>
          <p className="text-lg text-gray-300 mb-6" style={{ color: result.color }}>
            {result.text}
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
} 