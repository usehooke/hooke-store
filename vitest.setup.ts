import React from 'react';
import { vi } from 'vitest';

// Mock IntersectionObserver for jsdom (required by framer-motion)
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
};

// Mock next/link for Vitest – returns a simple <a> element
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => React.createElement('a', { href }, children),
}));

// Mock next-cloudinary is already done in each test file, but you can also place a global mock here if desired.
