import React from "react";

interface LanguageChipProps {
  locale: string;
  onChange: (locale: string) => void;
}

export default function LanguageChip({ locale, onChange }: LanguageChipProps) {
  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-0 rounded-full text-xs font-semibold transition-colors border ${locale === 'ja' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-800 border-gray-300'}`}
        onClick={() => onChange('ja')}
      >
        日本語
      </button>
      <button
        className={`px-3 py-0 rounded-full text-xs font-semibold transition-colors border ${locale === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-800 border-gray-300'}`}
        onClick={() => onChange('en')}
      >
        English
      </button>
    </div>
  );
} 