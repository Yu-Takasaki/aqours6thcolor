import React, { useEffect, useState } from "react";

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
  const [show, setShow] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setVisible(true), 10); // 10msでopacity:1に
    } else {
      setVisible(false);
      const timer = setTimeout(() => setShow(false), 500); // 0.5秒後にDOM削除
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${visible ? 'opacity-100 bg-black bg-opacity-50' : 'opacity-0 bg-black bg-opacity-0'}`}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div className={`bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center">
          <div className="mb-4">
            <img 
              src={result.image} 
              alt={result.member}
              className="w-32 h-32 mx-auto rounded-full object-contain"
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