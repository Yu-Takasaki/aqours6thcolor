import React from "react";

interface SeatTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SeatTypeSelector({ value, onChange }: SeatTypeSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h4 className="text-xl font-semibold text-center mb-4">座席の種類</h4>
      <select 
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">選択してください</option>
        <option value="arena">アリーナ</option>
        <option value="field">フィールドシート(スタンドFブロック)</option>
        <option value="other">上記以外</option>
      </select>
    </div>
  );
} 