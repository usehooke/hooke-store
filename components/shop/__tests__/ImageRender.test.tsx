import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/shop/ProductCard';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next-cloudinary as before
vi.mock('next-cloudinary', () => ({
  CldImage: (props: any) => <img src={props.src} alt={props.alt} data-testid="cld-image" />,
}));

const mockProduct = {
  id: 'test-id-789',
  name: 'Teste Produto Imagem',
  price: 200,
  imageUrl: '/test-image.jpg',
  seoAltText: 'Imagem Teste',
} as any;

test('ProductCard renders cloud image with correct src', () => {
  render(<ProductCard product={mockProduct} />);
  const img = screen.getByTestId('cld-image');
  expect(img).toBeInTheDocument();
  
  // O ProductCard concatena o siteUrl para caminhos relativos
  const expectedSrc = `https://usehooke.com.br${mockProduct.imageUrl}`;
  expect(img).toHaveAttribute('src', expectedSrc);
});
