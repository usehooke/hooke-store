#!/usr/bin/env node
/**
 * scripts/run-diagnostics.mjs
 * Script Autônomo de Diagnóstico Contínuo da Hooke Store
 * Executado periodicamente via scheduler / cron para monitorar a saúde do e-commerce.
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.DIAGNOSTICS_TARGET_URL || 'https://www.usehooke.com.br';
const THRESHOLDS = {
  maxLatencyMs: 3000,
  minHttpStatus: 200,
  maxHttpStatus: 399,
};

const ROUTES = [
  { path: '/', name: 'Homepage (Vitrine)' },
  { path: '/colecao', name: 'Catálogo Geral' },
  { path: '/checkout', name: 'Checkout Form' },
  { path: '/produto/t-shirt-vintage-fusca-pto', name: 'Página de Produto (PDP)' },
  { path: '/api/health', name: 'Health Check API' },
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    const start = performance.now();
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Hooke-Continuous-Diagnostics/3.0',
        'Accept': 'text/html,application/json,*/*'
      },
      timeout: 8000
    }, (res) => {
      let bytes = 0;
      res.on('data', (chunk) => {
        bytes += chunk.length;
      });
      res.on('end', () => {
        const latencyMs = Math.round(performance.now() - start);
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 400,
          status: res.statusCode,
          latencyMs,
          bytes,
          headers: res.headers,
          ssl: url.startsWith('https'),
          error: null
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        ok: false,
        status: 0,
        latencyMs: Math.round(performance.now() - start),
        bytes: 0,
        headers: {},
        ssl: url.startsWith('https'),
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ok: false,
        status: 408,
        latencyMs: 8000,
        bytes: 0,
        headers: {},
        ssl: url.startsWith('https'),
        error: 'Timeout após 8000ms'
      });
    });
  });
}

async function run() {
  const timestamp = new Date().toISOString();
  console.log(`\n======================================================`);
  console.log(`🔎 [Hooke Diagnostics] Iniciando Auditoria Contínua`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`🎯 Alvo: ${BASE_URL}`);
  console.log(`======================================================\n`);

  const results = [];
  const alerts = [];

  for (const route of ROUTES) {
    const target = `${BASE_URL.replace(/\/$/, '')}${route.path}`;
    const res = await fetchUrl(target);
    results.push({ ...route, ...res });

    const statusBadge = res.ok ? '✅' : '❌';
    console.log(`${statusBadge} ${route.name.padEnd(25)} [${res.status || 'ERR'}] ${res.latencyMs}ms (${res.bytes} bytes)`);

    if (!res.ok) {
      alerts.push({
        level: 'CRÍTICO',
        target: route.name,
        msg: `Rota com falha HTTP ${res.status}: ${res.error || 'Não operacional'}`
      });
    } else if (res.latencyMs > THRESHOLDS.maxLatencyMs) {
      alerts.push({
        level: 'CRÍTICO',
        target: route.name,
        msg: `Latência de ${res.latencyMs}ms excedeu limite de ${THRESHOLDS.maxLatencyMs}ms`
      });
    }

    if (!res.headers['strict-transport-security'] && res.ssl) {
      alerts.push({
        level: 'MODERADO',
        target: route.name,
        msg: 'Cabeçalho HSTS ausente na resposta HTTPS'
      });
    }
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`🚨 Alertas Encontrados: ${alerts.length}`);
  alerts.forEach(a => console.log(`   [${a.level}] ${a.target}: ${a.msg}`));
  console.log(`------------------------------------------------------\n`);

  // Salvar relatório em docs/diagnostics se a pasta existir
  const docsDir = path.resolve('docs', 'diagnostics');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const reportMd = `# Relatório de Diagnóstico Contínuo — ${new Date().toLocaleDateString('pt-BR')}

- **Data/Hora:** ${timestamp}
- **Alvo:** ${BASE_URL}
- **Status Geral:** ${alerts.filter(a => a.level === 'CRÍTICO').length === 0 ? '✅ Operacional Saudável' : '⚠️ Anomalias Detectadas'}

## Resultados das Rotas
| Rota | Status | Latência | SSL | Diagnóstico |
|---|---|---|---|---|
${results.map(r => `| ${r.name} | ${r.status} | ${r.latencyMs}ms | ${r.ssl ? 'Sim' : 'Não'} | ${r.ok ? 'Operacional' : r.error} |`).join('\n')}

## Alertas
${alerts.length === 0 ? '- Nenhum alerta crítico registrado.' : alerts.map(a => `- **[${a.level}]** ${a.target}: ${a.msg}`).join('\n')}
`;

  const fileName = `report-${Date.now()}.md`;
  fs.writeFileSync(path.join(docsDir, fileName), reportMd);
  console.log(`💾 Snapshot arquivado em: docs/diagnostics/${fileName}\n`);
}

run().catch(console.error);
