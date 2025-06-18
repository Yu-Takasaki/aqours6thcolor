"use client";

import React, { useState } from "react";
import SeatTypeSelector from "./_components/SeatTypeSelector";
import BaseSelector from "./_components/BaseSelector";
import BlockSelector from "./_components/BlockSelector";
import RowNumberSelector from "./_components/RowNumberSelector";
import ResultModal from "./_components/ResultModal";
import InfoAccordion from "./_components/InfoAccordion";
import { findColor, getResult } from "./lib/seatData";

export default function Home() {
  const [seatType, setSeatType] = useState("");
  const [base, setBase] = useState("");
  const [block, setBlock] = useState("");
  const [row, setRow] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState({ color: "", member: "", text: "", image: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // バリデーション関数
  const validateField = (value: string, fieldName: string): boolean => {
    const isValid = Boolean(value && value !== "選択してください");
    setErrors(prev => ({ ...prev, [fieldName]: !isValid }));
    return isValid;
  };

  // 座席タイプ変更時の処理
  const handleSeatTypeChange = (value: string) => {
    setSeatType(value);
    setBase("");
    setBlock("");
    setRow("");
    setErrors({});
    if (value === "arena" || value === "field") {
      // memberは"chika"でOKなら
      const resultData = getResult("chika");
      setResult(resultData);
      setShowModal(true);
    }
  };

  // 塁側変更時の処理
  const handleBaseChange = (value: string) => {
    setBase(value);
    setBlock("");
    setRow("");
    setErrors({});
    if (value) {
      validateField(value, "base");
    }
  };

  // ブロック変更時の処理
  const handleBlockChange = (value: string) => {
    setBlock(value);
    setRow("");
    setErrors({});
    if (value) {
      validateField(value, "block");
    }
  };

  // 列変更時の処理
  const handleRowChange = (value: string) => {
    setRow(value);
    setErrors(prev => ({ ...prev, row: !validateField(value, "row") }));
    // 「それ以外」の場合、列が選択されたら即結果を表示
    if (seatType === "other" && value) {
      try {
        const seatRow = Number(value);
        const member = findColor(block, seatRow);
        const resultData = getResult(member);
        setResult(resultData);
        setShowModal(true);
      } catch (error) {
        const errorResult = getResult("error");
        setResult(errorResult);
        setShowModal(true);
      }
    }
  };

  // 検索処理
  const handleSearch = () => {
    // バリデーション
    const isSeatTypeValid = validateField(seatType, "seatType");
    const isBaseValid = seatType === "other" ? validateField(base, "base") : true;
    const isBlockValid = seatType === "other" ? validateField(block, "block") : true;
    const isRowValid = seatType === "other" ? validateField(row, "row") : true;

    if (!isSeatTypeValid || !isBaseValid || !isBlockValid || !isRowValid) {
      return;
    }

    try {
      let member: string;

      // スタンド席以外（アリーナ、フィールドシート）
      if (seatType !== "other") {
        member = "chika"; // 高海千歌（みかん色）
      } else {
        // スタンド席の場合
        const seatRow = Number(row);
        member = findColor(block, seatRow);
      }

      const resultData = getResult(member);
      setResult(resultData);
      setShowModal(true);
    } catch (error) {
      const errorResult = getResult("error");
      setResult(errorResult);
      setShowModal(true);
    }
  };

  // 検索ボタンの有効/無効状態
  const isSearchButtonEnabled = () => {
    if (!seatType) return false;
    
    if (seatType === "other") {
      return Boolean(base && block && row && 
             !errors.base && !errors.block && !errors.row);
    }
    
    return true; // アリーナ、フィールドシートの場合は常に有効
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-normal mt-3 pb-2 border-b-4 border-gray-600 rounded-lg">
            <i className="fas fa-search mr-2"></i>
            担当色検索inベルーナドーム
          </h2>
          
          <div className="mt-4">
            <InfoAccordion />
            
            <div className="space-y-4">
              <SeatTypeSelector 
                value={seatType} 
                onChange={handleSeatTypeChange} 
              />
              
              {seatType === "other" && (
                <BaseSelector 
                  value={base} 
                  onChange={handleBaseChange}
                  seatType={seatType}
                />
              )}
              
              {seatType === "other" && base && (
                <BlockSelector 
                  value={block} 
                  onChange={handleBlockChange}
                  seatType={seatType}
                  base={base}
                />
              )}
              
              {seatType === "other" && base && block && (
                <RowNumberSelector 
                  row={row}
                  onRowChange={handleRowChange}
                  seatType={seatType}
                  base={base}
                  block={block}
                />
              )}
            </div>

            {/* 検索ボタン */}
            <div className="mt-4 mb-8">
              <div className="w-full">
                <button 
                  className={`w-full py-2 px-6 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                    isSearchButtonEnabled()
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSearch}
                  disabled={!isSearchButtonEnabled()}
                >
                  <i className="fas fa-search mr-2"></i>
                  <span>担当色を見る！</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <ResultModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result}
      />
    </div>
  );
}
