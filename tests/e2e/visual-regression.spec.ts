import { test, expect } from '@playwright/test';

test.describe('Regressão Visual (Escudo Estético Hooke)', () => {

  test('Cenário 1: Regressão Visual da Home', async ({ page }) => {
    // Acessa a página inicial
    await page.goto('/');
    
    // Aguarda o carregamento dos elementos e a conclusão de possíveis animações iniciais estáticas
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Garante que a transição inicial (opacidade) terminou
    
    // Tira screenshot comparativo da viewport
    await expect(page).toHaveScreenshot('home-viewport.png', {
      maxDiffPixelRatio: 0.02, // Tolerância pequena para diferenças de renderização de subpixel
    });
  });

  test('Cenário 2: Regressão Visual da Página de Login', async ({ page }) => {
    // Acessa a página de login
    await page.goto('/login');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Tira screenshot da tela de autenticação
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Cenário 3: Regressão Visual do Layout de Checkout', async ({ page }) => {
    // 1. Ir para a home e adicionar um item no carrinho para que o checkout exiba o produto
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Seleciona o primeiro card de produto disponível na vitrine de forma genérica
    const productCard = page.locator('.grid > div').first();
    await expect(productCard).toBeVisible();

    // Seleciona o primeiro botão de tamanho comum disponível dentro do card
    const sizeButton = productCard.locator('button').filter({ hasText: /^(P|M|G|GG|UN)$/ }).first();
    await expect(sizeButton).toBeVisible();
    await sizeButton.click();

    // Clica no botão de compra do card
    const buyButton = productCard.getByRole('button', { name: /Comprar/i });
    await expect(buyButton).toBeVisible();
    await buyButton.click();

    // 2. Aguarda redirecionamento ao checkout
    await page.waitForURL('**/checkout');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Aguarda renderização dos componentes

    // Oculta elementos dinâmicos ou instáveis como o campo de CEP para evitar falso-positivo em campos de cursor
    await expect(page).toHaveScreenshot('checkout-clean-layout.png', {
      maxDiffPixelRatio: 0.05, // Tolerância ligeiramente maior devido a loaders de mapas/fretes externos
    });
  });

});
