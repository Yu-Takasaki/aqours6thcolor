import React from "react";
import { getSeatTypeOptions } from "../lib/seatData";

interface SeatTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  messages: Record<string, string>;
  locale: 'ja' | 'en';
}

export default function SeatTypeSelector({ value, onChange, messages, locale }: SeatTypeSelectorProps) {
  const seatTypeOptions = getSeatTypeOptions(locale);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h4 className="text-xl font-semibold text-center mb-3">{messages['seat_type']}</h4>
      <select 
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{messages['select']}</option>
        {seatTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 