import React from "react";
import { getRowOptions } from "../lib/seatData";

interface RowNumberSelectorProps {
  row: string;
  onRowChange: (value: string) => void;
  seatType: string;
  base: string;
  block: string;
  messages: Record<string, string>;
}

export default function RowNumberSelector({ 
  row, 
  onRowChange, 
  seatType, 
  base, 
  block, 
  messages
}: RowNumberSelectorProps) {
  const rowOptions = getRowOptions(seatType, base, block);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h4 className="text-xl font-semibold text-center mb-3">{messages['row']}</h4>
      <select 
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={row}
        onChange={(e) => onRowChange(e.target.value)}
        disabled={!block}
      >
        <option value="">{messages['select']}</option>
        {rowOptions.map((rowNum: string) => (
          <option key={rowNum} value={rowNum}>{rowNum}</option>
        ))}
      </select>
      {!row && block && (
        <div className="text-red-400 text-sm mt-2">{messages['select_row']}</div>
      )}
    </div>
  );
} 