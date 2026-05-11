import { test, expect } from '@playwright/test';

test.describe('PDV: Resiliency & UX', () => {
  test.beforeEach(async ({ page }) => {
    // Simular Login Admin
    await page.goto('/admin/pdv');
  });

  test('Deve abrir modal de tamanho ao clicar em um produto e adicionar ao carrinho', async ({ page }) => {
    // 1. Localiza um produto na vitrine
    const firstProduct = page.locator('section grid button').first();
    await firstProduct.click();

    // 2. Verifica se o Modal de Tamanho abriu
    await expect(page.getByText('Escolha o Tamanho')).toBeVisible();

    // 3. Clica em um tamanho (ex: G)
    await page.getByRole('button', { name: 'G', exact: true }).click();

    // 4. Verifica se o item apareceu no carrinho (Right Sidebar)
    await expect(page.locator('aside')).toContainText('(G)');
  });

  test('Deve abrir o Modal Híbrido ao clicar em Cobrar', async ({ page }) => {
    // Adiciona item primeiro
    await page.locator('section grid button').first().click();
    await page.getByRole('button', { name: 'G', exact: true }).click();

    // Clica em Cobrar
    await page.getByRole('button', { name: /Cobrar/i }).click();

    // Verifica opções de pagamento
    await expect(page.getByText('MAQUININHA (LOJA)')).toBeVisible();
    await expect(page.getByText('PIX NA TELA (TABLET)')).toBeVisible();
  });

  test('Stress Test: Resiliência Offline', async ({ page, context }) => {
    // 1. Adiciona item
    await page.locator('section grid button').first().click();
    await page.getByRole('button', { name: 'M', exact: true }).click();

    // 2. Simular perda de conexão
    await context.setOffline(true);

    // 3. Tenta finalizar venda via Maquininha
    await page.getByRole('button', { name: /Cobrar/i }).click();
    await page.getByText('MAQUININHA (LOJA)').click();

    // 4. Verifica se a UI reagiu corretamente (ex: Mensagem de fila offline ou sucesso otimista)
    await expect(page.getByText(/Venda Concluída/i)).toBeVisible();
    
    // Restaurar conexão
    await context.setOffline(false);
  });
});
