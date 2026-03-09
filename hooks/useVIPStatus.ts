'use client';

import { useState, useEffect } from 'react';

const HOOKE_BEHAVIOR_KEY = 'hooke_user_behavior';

interface UserBehavior {
  visitCount: number;
  lastVisit: number;
  purchases: number;
  lastProductSlug?: string;
}

export function useVIPStatus() {
  const [behavior, setBehavior] = useState<UserBehavior>({
    visitCount: 0,
    lastVisit: Date.now(),
    purchases: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem(HOOKE_BEHAVIOR_KEY);
    let current: UserBehavior = saved 
      ? JSON.parse(saved) 
      : { visitCount: 0, lastVisit: Date.now(), purchases: 0 };

    // Só incrementa visita se passou mais de 1 hora da última
    const oneHour = 1000 * 60 * 60;
    if (Date.now() - current.lastVisit > oneHour) {
      current.visitCount += 1;
    }
    
    current.lastVisit = Date.now();
    localStorage.setItem(HOOKE_BEHAVIOR_KEY, JSON.stringify(current));
    setBehavior(current);
  }, []);

  const isRecurring = behavior.visitCount >= 2;
  const isVIP = behavior.purchases > 0 || behavior.visitCount >= 5;

  return { 
    isRecurring, 
    isVIP, 
    behavior 
  };
}
