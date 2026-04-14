"use client";

import { useEffect, useState } from "react";
import { usePDVStore, selectPendingSales } from "@/store/pdv-store";
import { useShallow } from 'zustand/react/shallow';
import { toast } from "sonner";

export function useSyncOfflineSales() {
  const pendingSales = usePDVStore(useShallow(selectPendingSales));
  const updateSaleStatus = usePDVStore(state => state.updateSaleStatus);
  const removeFromQueue = usePDVStore(state => state.removeFromQueue);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isContingencyMode, setIsContingencyMode] = useState(false);
  const [failureCount, setFailureCount] = useState(0);

  useEffect(() => {
    const syncSales = async () => {
      const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
      if (pendingSales.length === 0 || isSyncing || !isOnline || isContingencyMode) return;

      setIsSyncing(true);

      for (const sale of pendingSales) {
        // Pular vendas que já exauriram as tentativas
        if (sale.status === 'exhausted') continue;

        try {
          const response = await fetch("/api/pdv/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...sale, syncAttempt: sale.retryCount + 1 }),
          });

          const result = await response.json();

          if (response.ok) {
            removeFromQueue(sale.id);
            setFailureCount(0);
            toast.success(`Venda ${sale.id.slice(-4)} sincronizada com sucesso!`);
          } else {
            const errorMsg = result.error || "Erro no servidor ERP";
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Erro de conexão";
          console.error(`❌ [Sync Error] Venda ${sale.id}:`, errorMessage);
          
          const newRetryCount = sale.retryCount + 1;
          const nextStatus = newRetryCount >= 5 ? 'exhausted' : 'failed';
          
          updateSaleStatus(sale.id, nextStatus, errorMessage);

          if (nextStatus === 'exhausted') {
             toast.error(`Venda ${sale.id.slice(-4)} marcada como EXAURIDA. Verifique manualmente.`, {
                description: errorMessage,
                duration: 5000
             });
          }

          setFailureCount(prev => prev + 1);

          // Circuit Breaker: 3 falhas consecutivas bloqueiam por 30s
          if (failureCount >= 2) {
            setIsContingencyMode(true);
            toast.warning("Modo Contingência Ativo", { description: "Múltiplas falhas de síncronia. Aguardando 30s." });
            setTimeout(() => {
              setIsContingencyMode(false);
              setFailureCount(0);
            }, 30000);
            break;
          }
        }
      }

      setIsSyncing(false);
    };

    const interval = setInterval(syncSales, 10000);
    return () => clearInterval(interval);
  }, [pendingSales, isSyncing, updateSaleStatus, removeFromQueue, isContingencyMode, failureCount]);

  const exhaustedCount = pendingSales.filter(s => s.status === 'exhausted').length;
  const actuallyPendingCount = pendingSales.length - exhaustedCount;

  return { 
    isSyncing, 
    pendingCount: actuallyPendingCount, 
    exhaustedCount,
    isContingencyMode 
  };
}
