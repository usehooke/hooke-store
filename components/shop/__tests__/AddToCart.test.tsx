import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Hoist mock state to be available for vi.mock
const { mockAddItem, mockCartItems } = vi.hoisted(() => ({
  mockAddItem: vi.fn((product: any, size: any) => {
    mockCartItems.push({ ...product, selectedSize: size, quantity: 1, cartItemId: `${product.id}-${size}` });
  }),
  mockCartItems: [] as any[],
}));

// Mock the store
vi.mock('@/store/cart-store', () => {
  const mockUseCartStore = vi.fn(() => ({
    items: mockCartItems,
    addItem: mockAddItem,
  }));
  (mockUseCartStore as any).getState = vi.fn(() => ({
    items: mockCartItems,
    addItem: mockAddItem,
  }));
  return { useCartStore: mockUseCartStore };
});

// Mock next-cloudinary
vi.mock('next-cloudinary', () => ({
  CldImage: (props: any) => <img src={props.src} alt={props.alt} data-testid="cld-image" />,
}));

// Import component AFTER mocks are defined
import ProductCard from '@/components/shop/ProductCard';

const mockProduct = {
  id: 'test-id-456',
  name: 'Teste Produto Cart',
  price: 150,
  imageUrl: '/test-cart.jpg',
  seoAltText: 'Teste Produto Cart',
} as any;

test('clicking Add to Cart adds item to cart store', () => {
  render(<ProductCard product={mockProduct} />);
  
  const button = screen.getByText(/Adicionar ao carrinho/i);
  fireEvent.click(button);
  
  expect(mockAddItem).toHaveBeenCalled();
  expect(mockCartItems).toHaveLength(1);
  expect(mockCartItems[0].id).toBe(mockProduct.id);
});
