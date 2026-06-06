import { test, expect } from '@playwright/test';

test.describe('Checkout Flow E2E (Escudo de Automação)', () => {

  test('Cenário 1: Jornada de Compra Direta Completa', async ({ page }) => {
    // 1. Acessar a Home
    await page.goto('/');

    // 2. Aguardar a vitrine carregar com os mock products e clicar na Camiseta Heavy Black
    const productCard = page.locator('article', { hasText: /Camiseta Heavy Black/i }).first();
    await expect(productCard).toBeVisible();

    // 3. Escolher o tamanho M
    const sizeButton = productCard.getByRole('button', { name: 'M', exact: true });
    await sizeButton.click();
    await expect(sizeButton).toHaveAttribute('aria-pressed', 'true');

    // 4. Clicar em Comprar Agora
    await productCard.getByRole('button', { name: /Comprar Agora/i }).click();

    // 5. Verificar redirecionamento para o checkout
    await page.waitForURL('**/checkout');
    await expect(page.getByRole('heading', { name: /Finalizar Pedido/i })).toBeVisible();
    await expect(page.getByText('Camiseta Heavy Black')).toBeVisible();

    // 6. Interceptar API de Frete e Mockar Resposta
    await page.route('**/api/shipping', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          fretes: [
            { nome: 'SEDEX Expresso', valor: '19.90', prazo: '2' },
            { nome: 'PAC Normal', valor: '9.90', prazo: '5' }
          ]
        })
      });
    });

    // 7. Digitar CEP
    await page.getByPlaceholder('Digite seu CEP').fill('01311200');
    // Esperar um pouco para que o botão fique ativado e clicar
    const btnCalcular = page.getByRole('button', { name: /CALCULAR/i });
    if (await btnCalcular.isVisible()) {
      await btnCalcular.click();
    }

    // 8. Aguardar o frete aparecer e verificar se a primeira opção foi selecionada
    await expect(page.getByText('SEDEX Expresso (até 2 dias úteis)')).toBeVisible();
    await expect(page.getByText('PAC Normal (até 5 dias úteis)')).toBeVisible();

    // 9. Preencher Dados do Comprador
    await page.getByPlaceholder('Nome completo').fill('Cliente Teste Hooke');
    await page.getByPlaceholder('(11) 99999-9999').fill('11999999999');
    await page.getByPlaceholder('Opcional').fill('teste@usehooke.com.br');

    // 10. Interceptar API de Checkout
    let apiPayload: any = null;
    await page.route('**/api/checkout', async (route) => {
      apiPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'pref_test_123',
          init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref_test_123',
          orderId: 'hooke-e2e-order'
        })
      });
    });

    // 11. Clicar em Finalizar e Pagar
    const finalizeBtnDesktop = page.getByRole('button', { name: /FINALIZAR E PAGAR/i });
    if (await finalizeBtnDesktop.isVisible()) {
        await finalizeBtnDesktop.click();
    } else {
        await page.getByRole('button', { name: /FINALIZAR · /i }).click();
    }

    // 12. Validar o redirecionamento ou o payload da API
    // Aguardar uma janela de tempo curta para a requisição da API acontecer
    await page.waitForTimeout(500);
    
    expect(apiPayload).not.toBeNull();
    expect(apiPayload.customer.name).toBe('Cliente Teste Hooke');
    expect(apiPayload.customer.phone).toBe('11999999999');
    expect(apiPayload.items[0].title).toContain('Camiseta Heavy Black');
    expect(apiPayload.shippingMethod).toBe('SEDEX Expresso');
  });

  test('Cenário 2: Resiliência de Frete', async ({ page }) => {
    await page.goto('/');
    
    // Simula ir direto ao checkout
    const productCard = page.locator('article', { hasText: /Retro Beetle Areia/i }).first();
    await expect(productCard).toBeVisible();

    await productCard.getByRole('button', { name: 'G', exact: true }).click();
    await productCard.getByRole('button', { name: /Comprar Agora/i }).click();
    
    await page.waitForURL('**/checkout');

    // Forçar Erro 500 na API de Frete
    await page.route('**/api/shipping', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.getByPlaceholder('Digite seu CEP').fill('99999999');
    const btnCalcular = page.getByRole('button', { name: /CALCULAR/i });
    if (await btnCalcular.isVisible()) {
      await btnCalcular.click();
    }

    // Deve cair no fallback automático do CheckoutForm
    await expect(page.getByText('SEDEX (1-3 dias úteis)')).toBeVisible();
    await expect(page.getByText('PAC (5-10 dias úteis)')).toBeVisible();
  });

  test('Cenário 3: Navegação pela Página do Produto', async ({ page }) => {
    // Entrar na página de um produto específico
    await page.goto('/produto/retro-beetle-areia');
    
    // Verificar se a página carregou os detalhes do produto
    await expect(page.getByRole('heading', { name: /Retro Beetle Areia/i })).toBeVisible();

    // Clicar em "G"
    const sizeButton = page.getByRole('button', { name: 'G', exact: true });
    await sizeButton.click();

    // Clicar no Adicionar ao Carrinho
    await page.getByRole('button', { name: /ADICIONAR AO CARRINHO/i }).click();

    // Verificar se o toast de notificação apareceu (texto de carrinho)
    await expect(page.getByText('adicionado ao carrinho', { exact: false })).toBeVisible();
  });

});
