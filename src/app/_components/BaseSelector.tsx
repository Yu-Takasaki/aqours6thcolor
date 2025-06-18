import React from "react";
import { getBaseOptions } from "../lib/seatData";

interface BaseSelectorProps {
  value: string;
  onChange: (value: string) => void;
  seatType: string;
  messages: Record<string, string>;
  locale: 'ja' | 'en';
}

export default function BaseSelector({ value, onChange, seatType, messages, locale }: BaseSelectorProps) {
  const baseOptions = getBaseOptions(seatType, locale);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h4 className="text-xl font-semibold text-center mb-3">{messages['base']}</h4>
      <p className="text-gray-400 text-sm mb-3">{messages['base_note']}</p>
      <select 
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!seatType}
      >
        <option value="">{messages['select']}</option>
        {baseOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {!value && seatType && (
        <div className="text-red-400 text-sm mt-2">{messages['select_base']}</div>
      )}
    </div>
  );
} 