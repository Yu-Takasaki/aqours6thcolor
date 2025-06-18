import React from "react";
import { getBlockOptions } from "../lib/seatData";

interface BlockSelectorProps {
  value: string;
  onChange: (value: string) => void;
  seatType: string;
  base: string;
  messages: Record<string, string>;
}

export default function BlockSelector({ value, onChange, seatType, base, messages }: BlockSelectorProps) {
  const blockOptions = getBlockOptions(seatType, base);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h4 className="text-xl font-semibold text-center mb-3">{messages['block']}</h4>
      <select 
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-red-400 text-sm mt-2">{messages['select_block']}</div>
      )}
    </div>
  );
} 