import React from "react";
import { getBlockOptions } from "../lib/seatData";

interface BlockSelectorProps {
  value: string;
  onChange: (value: string) => void;
  seatType: string;
  base: string;
  messages: Record<string, string>;
  locale: 'ja' | 'en';
}

export default function BlockSelector({ value, onChange, seatType, base, messages, locale }: BlockSelectorProps) {
  const blockOptions = getBlockOptions(seatType, base, locale);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-2">
      <h4 className="text-sm font-semibold text-center mb-2">{messages['block']}</h4>
      <select 
        className="w-full px-4 py-1 text-xs bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!base}
      >
        <option value="">{messages['select']}</option>
        {blockOptions.map((block) => (
          <option key={block} value={block}>{block}</option>
        ))}
      </select>
      {!value && base && (
        <div className="text-red-400 text-xs mt-2">{messages['select_block']}</div>
      )}
    </div>
  );
} 