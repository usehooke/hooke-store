import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock do Firebase para evitar chamadas reais durante testes unitários
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  FacebookAuthProvider: class {},
}));

// Mock IntersectionObserver para jsdom (requerido por framer-motion)
global.IntersectionObserver = class {
  root: any;
  rootMargin: string;
  thresholds: number[];
  constructor(callback: any, options: any = {}) {
    this.root = options.root || null;
    this.rootMargin = options.rootMargin || '';
    this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
} as any;

// Mock next/link para Vitest – retorna um elemento <a> simples
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => React.createElement('a', { href }, children),
}));
