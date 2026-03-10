"use client";

import Barcode from "react-barcode";

interface BarcodeLabelProps {
  sku: string;
  name: string;
  size: string;
}

export default function BarcodeLabel({ sku, name, size }: BarcodeLabelProps) {
  return (
    <div className="w-[151px] h-[94px] bg-white border border-gray-100 p-2 flex flex-col items-center justify-between text-black overflow-hidden font-sans">
      {/* Brand & Name */}
      <div className="text-center w-full">
        <h3 className="text-[12px] font-black uppercase tracking-tighter leading-none mb-1">Hooke</h3>
        <p className="text-[8px] font-bold uppercase truncate leading-none opacity-70">{name}</p>
      </div>

      {/* Barcode Area */}
      <div className="flex-1 flex items-center justify-center scale-[0.85] origin-center">
        <Barcode 
          value={sku} 
          width={1.4} 
          height={40} 
          fontSize={10}
          margin={0}
          background="transparent"
        />
      </div>

      {/* Info Base - Only Size & SKU code */}
      <div className="flex justify-between w-full items-end pt-1">
        <div className="flex flex-col">
            <span className="text-[6px] font-black opacity-50 uppercase leading-none">TAM</span>
            <span className="text-[12px] font-black leading-none">{size}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[6px] font-black opacity-30 uppercase leading-none italic">Elite SKU</span>
        </div>
      </div>
    </div>
  );
}
