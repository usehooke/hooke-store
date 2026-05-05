import React from 'react';
import { vi } from 'vitest';
vi.mock('next-cloudinary', () => ({
  CldImage: (props: any) => <img src={props.src} alt={props.alt} data-testid="cld-image" />,
}));

import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/shop/ProductCard';
import '@testing-library/jest-dom';

test('ProductCard uses product.id when slug is missing', () => {
  const product = {
    id: 'test-id-123',
    name: 'Teste Produto',
    price: 100,
    imageUrl: '/test.jpg',
    // slug intentionally omitted
    seoAltText: 'Teste Produto',
  } as any; // minimal mock

  render(<ProductCard product={product} />);

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', expect.stringContaining(product.id));
  expect(link.getAttribute('href')).not.toContain('undefined');
});
