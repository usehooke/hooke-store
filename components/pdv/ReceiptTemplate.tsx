"use client";

import { PDVItem } from "@/store/pdv-store";
import { X, Printer } from "lucide-react";

interface ReceiptProps {
  saleId: string | null;
  items: PDVItem[];
  total: number;
  paymentMethod: string;
  onClose: () => void;
}

export default function ReceiptTemplate({ saleId, items, total, paymentMethod, onClose }: ReceiptProps) {
  if (!saleId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm print:bg-white print:p-0">
      <div className="bg-white w-full max-w-[320px] p-8 shadow-2xl relative print:shadow-none print:max-w-none print:w-full print:p-2">
        
        {/* Actions - Hidden in print */}
        <div className="absolute top-4 right-4 flex gap-2 print:hidden">
          <button onClick={handlePrint} className="p-2 bg-hooke-900 text-white rounded-none hover:bg-black transition-colors">
            <Printer size={18} />
          </button>
          <button onClick={onClose} className="p-2 bg-gray-200 text-gray-700 rounded-none hover:bg-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center font-mono text-[12px] uppercase">
          <h1 className="text-2xl font-black lowercase tracking-tighter mb-1 mt-4">hooke</h1>
          <p className="text-[10px] mb-4 opacity-70">Brás - São Paulo, SP</p>
          
          <div className="border-t border-dashed border-gray-300 my-4"></div>
          
          <div className="flex justify-between mb-2 font-bold">
            <span>DATA:</span>
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between mb-4 font-bold">
            <span>PEDIDO:</span>
            <span>#{saleId.slice(-6)}</span>
          </div>

          <div className="border-t border-dashed border-gray-300 my-4"></div>
          
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2">ITEM</th>
                <th className="pb-2 text-right">QTD</th>
                <th className="pb-2 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(items) && items.map((item, idx) => (
                <tr key={idx} className="text-[10px]">
                  <td className="py-2">
                    {item.name}
                    <br />
                    <span className="opacity-60">{item.selectedSize}</span>
                  </td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-gray-300 my-4"></div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-lg font-black italic">
              <span>TOTAL:</span>
              <span>R$ {(total || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between opacity-70">
              <span>PAGAMENTO:</span>
              <span className="font-bold">{paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 my-4"></div>
          
          <p className="text-[9px] italic leading-tight opacity-50">
            Agradecemos a preferência!<br />
            Trocas somente com este comprovante.<br />
            usehooke.com.br
          </p>

          <div className="mt-6 flex justify-center print:hidden">
             {/* QR Code MOCK */}
             <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                <span className="text-[8px] opacity-30">QR CODE SITE</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
