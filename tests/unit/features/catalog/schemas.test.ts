import { describe, it, expect } from 'vitest';
import { productSchema } from "@/features/catalog/schemas";
import { Department, Size } from "@/types";

describe("Catalog Schemas", () => {
  it("should validate a valid product", () => {
    const validProduct = {
      id: "test-prod",
      name: "Test Product",
      slug: "test-product", // Corrigido: Campo obrigatório no schema
      description: "A high-quality test product", // Corrigido: Campo obrigatório no schema
      price: 99.9,
      department: Department.MASCULINO,
      sizes: [Size.P, Size.M],
      imageUrl: "/test.jpg",
      images: ["/test.jpg"],
      category: "Test",
      details: { fabric: "Cotton", model: "Regular", wash: "Normal" }
    };
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should fail on negative price", () => {
    const invalidProduct = {
      id: "test-prod",
      name: "Test Product",
      slug: "test-product",
      description: "A high-quality test product",
      price: -10,
      department: Department.MASCULINO,
      sizes: [Size.P],
      imageUrl: "/test.jpg",
      images: ["/test.jpg"]
    };
    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it("should fail on invalid department", () => {
    const invalidProduct = {
      id: "test-prod",
      name: "Test Product",
      slug: "test-product",
      description: "A high-quality test product",
      price: 99.9,
      department: "INVALID",
      sizes: [Size.P],
      imageUrl: "/test.jpg",
      images: ["/test.jpg"]
    };
    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });
});
