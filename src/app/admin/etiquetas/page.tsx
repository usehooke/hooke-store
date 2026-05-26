"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

interface LabelData {
  id: string;
  shippingMethod: string;
  trackingCode: string;
  recipientName: string;
  street: string;
  cityState: string;
  cep: string;
  updatedAt: string;
}

const LabelGeneratorContent: React.FC = () => {
  const searchParams = useSearchParams();

  // Estado para a etiqueta ativa no editor
  const [activeLabel, setActiveLabel] = useState<Omit<LabelData, 'id' | 'updatedAt'>>({
    shippingMethod: 'CORREIOS (SEDEX)',
    trackingCode: 'HOOK-' + Math.floor(100000 + Math.random() * 900000),
    recipientName: '',
    street: '',
    cityState: '',
    cep: '',
  });

  // Auto-preenchimento via URL params
  useEffect(() => {
    const nome = searchParams.get('nome');
    const cep = searchParams.get('cep');
    const rua = searchParams.get('rua');
    const cidade = searchParams.get('cidade');
    const rastreio = searchParams.get('rastreio');
    const metodo = searchParams.get('metodo');

    if (nome || cep || rua || cidade || rastreio || metodo) {
      setActiveLabel(prev => ({
        ...prev,
        recipientName: nome || prev.recipientName,
        cep: cep || prev.cep,
        street: rua || prev.street,
        cityState: cidade || prev.cityState,
        trackingCode: rastreio || prev.trackingCode,
        shippingMethod: metodo || prev.shippingMethod,
      }));
    }
  }, [searchParams]);

  // Histórico de etiquetas salvas localmente (SaaS Offline-First)
  const [savedLabels, setSavedLabels] = useState<LabelData[]>([]);

  // Carrega o histórico do LocalStorage no mount
  useEffect(() => {
    const cache = localStorage.getItem('hooke_labels_history');
    if (cache) {
      setSavedLabels(JSON.parse(cache));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActiveLabel(prev => ({ ...prev, [name]: value }));
  };

  // Salva no LocalStorage antes de disparar a impressão
  const handlePrintProcess = () => {
    if (!activeLabel.recipientName || !activeLabel.cep) {
      alert('Por favor, preencha ao menos o Nome e o CEP do destinatário.');
      return;
    }

    const newLabel: LabelData = {
      ...activeLabel,
      id: 'lbl_' + Date.now(),
      updatedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedList = [newLabel, ...savedLabels.slice(0, 19)]; // Mantém o histórico das últimas 20
    setSavedLabels(updatedList);
    localStorage.setItem('hooke_labels_history', JSON.stringify(updatedList));

    // Executa o disparo para o hardware térmico
    window.print();
  };

  const handleLoadLabel = (label: LabelData) => {
    setActiveLabel({
      shippingMethod: label.shippingMethod,
      trackingCode: label.trackingCode,
      recipientName: label.recipientName,
      street: label.street,
      cityState: label.cityState,
      cep: label.cep,
    });
  };

  const handleClearForm = () => {
    setActiveLabel({
      shippingMethod: 'CORREIOS (SEDEX)',
      trackingCode: 'HOOK-' + Math.floor(100000 + Math.random() * 900000),
      recipientName: '',
      street: '',
      cityState: '',
      cep: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-['Inter'] antialiased text-black">
      
      {/* PAINEL WEB DE OPERAÇÃO - OCULTADO NA IMPRESSÃO */}
      <div className="no-print max-w-[1400px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: EDITOR E HISTÓRICO */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* CONTROLADOR PRINCIPAL (ESTILO HOOKE) */}
          <div className="bg-white p-5 sm:p-8 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-['Jost'] text-xl font-bold uppercase tracking-wider">Gerador de Etiquetas</h1>
              <button 
                onClick={handleClearForm}
                className="text-xs uppercase tracking-widest font-bold underline hover:text-zinc-600"
              >
                Limpar Campos
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Método de Envio</label>
                <select
                  name="shippingMethod"
                  value={activeLabel.shippingMethod}
                  onChange={handleInputChange}
                  className="border-b border-black bg-transparent py-2 text-sm font-medium focus:outline-none rounded-none"
                >
                  <option value="CORREIOS (SEDEX)">CORREIOS (SEDEX)</option>
                  <option value="CORREIOS (PAC)">CORREIOS (PAC)</option>
                  <option value="TRANSPORTADORA (JADLOG)">TRANSPORTADORA (JADLOG)</option>
                  <option value="TRANSPORTADORA (LOGGI)">TRANSPORTADORA (LOGGI)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Cód. Rastreio / Ref. Pedido</label>
                <input
                  type="text"
                  name="trackingCode"
                  value={activeLabel.trackingCode}
                  onChange={handleInputChange}
                  placeholder="Ex: vp101012"
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none rounded-none placeholder-zinc-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Nome do Destinatário (Quem Recebe)</label>
                <input
                  type="text"
                  name="recipientName"
                  value={activeLabel.recipientName}
                  onChange={handleInputChange}
                  placeholder="Nome completo de quem vai receber"
                  className="border-b border-black bg-transparent py-2 text-sm font-bold focus:outline-none rounded-none placeholder-zinc-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Endereço (Rua, Nº, Compl, Bairro)</label>
                <input
                  type="text"
                  name="street"
                  value={activeLabel.street}
                  onChange={handleInputChange}
                  placeholder="Ex: Rua dos Tupis, 1-241 - Centro"
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none rounded-none placeholder-zinc-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Cidade - UF</label>
                  <input
                    type="text"
                    name="cityState"
                    value={activeLabel.cityState}
                    onChange={handleInputChange}
                    placeholder="Ex: Belo Horizonte - MG"
                    className="border-b border-black bg-transparent py-2 text-sm focus:outline-none rounded-none placeholder-zinc-300"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={activeLabel.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    className="border-b border-black bg-transparent py-2 text-sm font-bold focus:outline-none rounded-none placeholder-zinc-300"
                  />
                </div>
              </div>

              <button
                onClick={handlePrintProcess}
                className="mt-4 bg-black text-white font-['Jost'] font-bold py-4 uppercase tracking-widest text-sm hover:bg-zinc-800 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none rounded-none"
              >
                [ DISPARAR PARA IMPRESSORA TÉRMICA ]
              </button>
            </div>
          </div>

          {/* HISTÓRICO RECENTE (OFFLINE CACHE) */}
          {savedLabels.length > 0 && (
            <div className="bg-white p-5 sm:p-6 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Últimas Etiquetas Emitidas</h2>
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2">
                {savedLabels.map((label) => (
                  <div 
                    key={label.id}
                    onClick={() => handleLoadLabel(label)}
                    className="flex justify-between items-center p-3 bg-white border-2 border-black hover:bg-black hover:text-white cursor-pointer transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-1px] translate-y-[-1px] hover:translate-x-0 hover:translate-y-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold truncate max-w-[180px]">{label.recipientName}</span>
                      <span className="text-[10px] opacity-70">{label.shippingMethod} | {label.trackingCode}</span>
                    </div>
                    <span className="text-[9px] opacity-60 text-right">{label.updatedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: LIVE PREVIEW DA ETIQUETA REAL */}
        <div className="lg:col-span-7 flex justify-center items-start lg:sticky lg:top-8 mt-4 lg:mt-0 max-w-full overflow-hidden">
          <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-full overflow-x-auto flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2 text-center min-w-[100mm]">Preview em Tela (100x150mm)</p>
            
            {/* CANVAS REAL DA ETIQUETA */}
            <div className="thermal-canvas mx-auto">
              <div className="t-header">
                <div className="t-brand">
                  <div className="t-logo">hooke</div>
                  <div className="t-cnpj">CNPJ 08.030.534/0001-72</div>
                </div>
                <div className="t-sender">
                  R. Tiers, 282<br />
                  Brás, São Paulo - SP<br />
                  CEP 03031-000
                </div>
              </div>

              <div className="t-line-thin"></div>

              <div className="t-logistics">
                <div className="t-badge">{activeLabel.shippingMethod || 'MÉTODO NÃO INFORMADO'}</div>
                <div className="t-track">
                  <span className="t-lbl">RASTREIO / PEDIDO</span>
                  <span className="t-val">{activeLabel.trackingCode || '-'}</span>
                </div>
              </div>

              <div className="t-line-thick"></div>

              <div className="t-recipient">
                <div className="t-meta">ENVIAR PARA:</div>
                <div className="t-name">{activeLabel.recipientName || 'NOME DO DESTINATÁRIO'}</div>
                <div className="t-address">
                  {activeLabel.street || 'Endereço completo, Nº, Bairro'}<br />
                  {activeLabel.cityState || 'Cidade - UF'}<br />
                  <div className="t-cep">CEP {activeLabel.cep || '00000-000'}</div>
                </div>
              </div>

              <div className="t-line-thin"></div>

              <div className="t-footer">
                <div className="t-foot-msg">
                  Obrigado por escolher o essencial.<br />
                  <strong>usehooke.com.br</strong>
                </div>
                <div className="t-qr">
                  {/* Gerador QR Dinâmico apontando para o site fixo conforme sua aprovação */}
                  <QRCodeSVG value="https://instagram.com/usehooke" width="100%" height="100%" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* RENDER EMBUTIDO DA FOLHA DE IMPRESSÃO (CSS ENGENHARIA TÉRMICA) */}
      <style>{`
        /* CANVAS DA ETIQUETA EM TELA */
        .thermal-canvas {
          width: 100mm;
          height: 150mm;
          padding: 6mm;
          background-color: #fff;
          color: #000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #000;
        }

        .t-line-thin { height: 1px; background-color: #000; width: 100%; margin: 3.5mm 0; }
        .t-line-thick { height: 2px; background-color: #000; width: 100%; margin: 3.5mm 0; }

        .t-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .t-brand .t-logo { font-family: 'Jost', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -1.2px; line-height: 1; text-transform: lowercase; }
        .t-brand .t-cnpj { font-size: 8px; font-weight: 500; letter-spacing: 0.5px; margin-top: 1.5mm; }
        .t-sender { text-align: right; font-size: 7.5px; line-height: 1.4; max-width: 45mm; font-weight: 400; }

        .t-logistics { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3mm; align-items: center; }
        .t-badge { background-color: #000; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-align: center; padding: 3mm 1mm; text-transform: uppercase; word-break: break-word; }
        .t-track { display: flex; flex-direction: column; padding-left: 1mm; }
        .t-track .t-lbl { font-size: 7.5px; font-weight: 700; }
        .t-track .t-val { font-size: 14px; font-weight: 700; }

        .t-recipient { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; padding: 1mm 0; }
        .t-recipient .t-meta { font-size: 9px; font-weight: 700; margin-bottom: 1.5mm; }
        .t-recipient .t-name { font-size: 18px; font-weight: 700; line-height: 1.2; margin-bottom: 2mm; letter-spacing: -0.3px; }
        .t-recipient .t-address { font-size: 11px; line-height: 1.4; font-weight: 400; }
        .t-recipient .t-cep { font-size: 13px; font-weight: 700; margin-top: 1.5mm; }

        .t-footer { display: flex; align-items: flex-end; justify-content: space-between; }
        .t-foot-msg { font-size: 9px; line-height: 1.4; font-weight: 400; }
        .t-qr { width: 26mm; height: 26mm; }
        .t-qr svg { width: 100%; height: 100%; shape-rendering: crispEdges; }

        /* REGRAS ESTRITAS DE DISPARO DA IMPRESSORA */
        @media print {
          /* Esconder toda a interface que não seja a etiqueta */
          .no-print {
            display: none !important;
          }
          
          /* Forçar ocultação de elementos do Layout Global do Admin (Sidebar, Bottom Nav) */
          nav, aside, header, footer {
            display: none !important;
          }
          
          /* Mira específica em nav bars inferiores que usam Tailwind */
          [class*="fixed bottom-0"] {
            display: none !important;
          }

          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          /* Anular qualquer overflow hidden de pais que possa "cortar" a etiqueta */
          * {
            overflow: visible !important;
          }

          /* A Etiqueta Térmica: Quebra o dom e fixa no canto superior esquerdo do papel */
          .thermal-canvas {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100mm !important;
            height: 150mm !important;
            border: none !important;
            margin: 0 !important;
            padding: 6mm !important;
            background: #ffffff !important;
            z-index: 999999 !important;
          }
          
          @page {
            size: 100mm 150mm;
            margin: 0;
          }
        }
      `}</style>

    </div>
  );
};

export default function LabelGeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-['Jost'] font-bold text-black uppercase tracking-widest">Carregando Módulo de Logística...</div>}>
      <LabelGeneratorContent />
    </Suspense>
  );
}
