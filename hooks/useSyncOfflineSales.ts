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
        try {
          updateSaleStatus(sale.id, 'pending');
          
          const response = await fetch("/api/pdv/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          });

          if (response.ok) {
            removeFromQueue(sale.id);
            setFailureCount(0); // Reset on success
            toast.success(`Venda ${sale.id.slice(-4)} sincronizada!`);
          } else {
            throw new Error("ERP error");
          }
        } catch (error) {
          console.error("Sync error:", error);
          const newFailureCount = failureCount + 1;
          setFailureCount(newFailureCount);
          updateSaleStatus(sale.id, 'failed');

          // Circuit Breaker: 3 fails = 30s contingency
          if (newFailureCount >= 3) {
            setIsContingencyMode(true);
            setTimeout(() => {
              setIsContingencyMode(false);
              setFailureCount(0);
            }, 30000);
            break; // Stop current loop
          }
        }
      }

      setIsSyncing(false);
    };

    const interval = setInterval(syncSales, 10000);
    return () => clearInterval(interval);
  }, [pendingSales, isSyncing, updateSaleStatus, removeFromQueue, isContingencyMode, failureCount]);

  return { isSyncing, pendingCount: pendingSales.length, isContingencyMode };
}
