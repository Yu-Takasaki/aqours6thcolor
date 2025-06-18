import React from "react";
import { getRowOptions } from "../lib/seatData";

interface RowNumberSelectorProps {
  row: string;
  number: string;
  onRowChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  seatType: string;
  base: string;
  block: string;
}

export default function RowNumberSelector({ 
  row, 
  number, 
  onRowChange, 
  onNumberChange, 
  seatType, 
  base, 
  block 
}: RowNumberSelectorProps) {
  const rowOptions = getRowOptions(seatType, base, block);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h4 className="text-xl font-semibold text-center mb-4">列(段)</h4>
        <select 
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={row}
          onChange={(e) => onRowChange(e.target.value)}
          disabled={!block}
        >
          <option value="">選択してください</option>
          {rowOptions.map((rowNum) => (
            <option key={rowNum} value={rowNum}>{rowNum}</option>
          ))}
        </select>
        {!row && block && (
          <div className="text-red-400 text-sm mt-2">列を選択してください。</div>
        )}
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h4 className="text-xl font-semibold text-center mb-4">番号</h4>
        <input 
          type="number" 
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="座席番号を入力してください。"
          min="1"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
        />
        {!number && (
          <div className="text-red-400 text-sm mt-2">番号を入力してください。</div>
        )}
      </div>
    </div>
  );
} 