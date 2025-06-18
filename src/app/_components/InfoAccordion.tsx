"use client";

import React, { useState } from "react";

export default function InfoAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 mb-4">
      <button
        className="w-full px-6 py-4 text-left font-semibold flex items-center justify-between hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>【立ち見席の方へ】</span>
        <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-300 leading-relaxed">
            立ち見席につきましては座席番号の記載ルールが不明瞭なため今回のAqoursRainbowでは詳細な色の指定をすることが難しくなってしまいました。<br />
            つきましては、立ち見席は自分達の前方のブロックの色を引き継いでいただきますようよろしくお願いいたします。
          </p>
        </div>
      )}
    </div>
  );
} 