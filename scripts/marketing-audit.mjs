#!/usr/bin/env node
/**
 * scripts/marketing-audit.mjs
 * CLI de Auditoria e Otimização de Marketing Digital da Hooke Store
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const TARGET_DOMAIN = 'https://www.usehooke.com.br';

async function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'HookeMarketingAudit/2.0' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    }).on('error', (err) => resolve({ status: 500, body: '', error: err.message }));
  });
}

async function auditSEO() {
  console.log('========================================================');
  console.log('🚀 [Hooke Marketing Audit] Iniciando Auditoria Completa');
  console.log('🎯 Domínio: ' + TARGET_DOMAIN);
  console.log('========================================================\n');

  const home = await fetchPage(TARGET_DOMAIN);
  const homeHtml = home.body;

  const checks = [
    { name: 'Tag Title', pass: homeHtml.includes('<title>'), detail: 'Título principal presente no head' },
    { name: 'Meta Description', pass: homeHtml.includes('name="description"'), detail: 'Descrição SEO indexável' },
    { name: 'Canonical Link', pass: homeHtml.includes('rel="canonical"'), detail: 'Tag canônica para evitar conteúdo duplicado' },
    { name: 'OpenGraph Tags', pass: homeHtml.includes('property="og:title"'), detail: 'Metatags para compartilhamento em redes sociais' },
    { name: 'JSON-LD Organization', pass: homeHtml.includes('"@type":"Organization"') || homeHtml.includes('"@type": "Organization"'), detail: 'Schema estruturado de empresa' },
    { name: 'JSON-LD WebSite', pass: homeHtml.includes('"@type":"WebSite"') || homeHtml.includes('"@type": "WebSite"'), detail: 'Schema de busca no Google' },
    { name: 'Google Analytics (GA4)', pass: homeHtml.includes('gtag') || homeHtml.includes('G-') || homeHtml.includes('GTM-'), detail: 'Tag de rastreamento instalada' },
  ];

  console.log('📋 AUDITORIA SEO ON-PAGE:');
  checks.forEach(c => {
    console.log(`  ${c.pass ? '✅' : '❌'} ${c.name.padEnd(24)} -> ${c.detail}`);
  });

  const docsDir = path.resolve('docs', 'marketing');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const report = `# Relatório de Auditoria de Marketing Digital Hooke

- Data: ${new Date().toISOString()}
- Domínio: ${TARGET_DOMAIN}
- Score Geral On-Page: ${Math.round((checks.filter(c => c.pass).length / checks.length) * 100)}%

## Checklist de SEO Técnico
${checks.map(c => `- [${c.pass ? 'x' : ' '}] **${c.name}**: ${c.detail}`).join('\n')}

## Recomendações Estratégicas
1. **Google Search Console**: Submeter periodicamente o sitemap para acelerar indexação das novas páginas de produtos.
2. **Meta Ads CBO**: Escalar o conjunto com o criativo do Opala SS e Fusca que operam com CTR acima de 2.6%.
3. **Remarketing**: Disparar régua de e-mail e anúncios dinâmicos de catálogo para quem adicionou itens à sacola nos últimos 7 dias.
`;

  const filename = `marketing-report-${Date.now()}.md`;
  fs.writeFileSync(path.join(docsDir, filename), report);
  console.log(`\n💾 Relatório salvo em: docs/marketing/${filename}\n`);
}

auditSEO().catch(console.error);
