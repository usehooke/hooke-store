const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando Validação Hooke Elite Standards (v1.0)...');

const PROHIBITED_PATTERNS = [
  {
    regex: /<img\s/g,
    message: 'ERRO: Tag <img> detectada. Use next/image para otimização.',
    exclude: ['docs/', 'node_modules/', 'components/ui/MetaPixel.tsx']
  },
  {
    regex: /: any[\s,;}>]/g,
    message: 'ERRO: Tipo "any" detectado. Use tipagem estrita.',
    exclude: ['docs/', 'node_modules/', 'components/ui/MetaPixel.tsx']
  },
  {
    regex: /console\.log\(/g,
    message: 'AVISO: console.log detectado. Remova antes de enviar para produção.',
    exclude: ['docs/', 'node_modules/', 'scripts/', 'app/api/']
  }
];

let hasErrors = false;

function checkFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', 'docs', '.git'].includes(file)) {
        checkFiles(fullPath);
      }
      continue;
    }

    if (!['.ts', '.tsx', '.js', '.jsx'].some(ext => file.endsWith(ext))) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    PROHIBITED_PATTERNS.forEach(pattern => {
      const normalizedPath = relativePath.split(path.sep).join('/');
      if (pattern.exclude.some(ex => normalizedPath.startsWith(ex) || normalizedPath === ex)) return;

      lines.forEach((line, index) => {
        if (pattern.regex.test(line)) {
          console.error(`\x1b[31m[ELITE FAIL]\x1b[0m ${relativePath}:${index + 1}: ${pattern.message}`);
          console.error(`   > ${line.trim()}`);
          hasErrors = true;
        }
        // Reset regex state for global flag
        pattern.regex.lastIndex = 0;
      });
    });
  }
}

try {
  checkFiles(process.cwd());

  if (hasErrors) {
    console.log('\n❌ Validação falhou. Corrija as violações acima para prosseguir.');
    process.exit(1);
  } else {
    console.log('\n✅ Hooke Elite Standards v1.0: Código Validado com Sucesso!');
    process.exit(0);
  }
} catch (error) {
  console.error('Erro ao executar validação elite:', error);
  process.exit(1);
}
