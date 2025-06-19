"use client";

import React, { useState } from "react";

interface InfoAccordionProps {
  messages: Record<string, string>;
}

export default function InfoAccordion({ messages }: InfoAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 mb-4">
      <button
        className="w-full px-6 py-2 text-left font-semibold flex items-center justify-between hover:bg-gray-700 transition-colors text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{messages['standing_title']}</span>
        <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-300 leading-relaxed text-xs">
            {messages['standing_body']}
          </p>
        </div>
      )}
    </div>
  );
} 