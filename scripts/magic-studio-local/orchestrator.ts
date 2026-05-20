import { exec } from 'child_process';
import { logInfo, logSuccess, logError, logProgress } from './utils/logger.js';
import path from 'path';

// Helper para rodar um motor via shell 'npx tsx' para garantir carregamento dinâmico
function runMotor(scriptName: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join('scripts', 'magic-studio-local', scriptName);
    const safeArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`);
    const command = `npx tsx ${scriptPath} ${safeArgs.join(' ')}`;
    
    logInfo('orchestrator.ts', `Executando: ${command}`);
    
    const child = exec(command);

    // Canaliza o output do terminal do subprocesso diretamente para o nosso terminal
    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      if (code === 0) {
        logSuccess('orchestrator.ts', `Motor ${scriptName} finalizou com sucesso.`);
        resolve();
      } else {
        logError('orchestrator.ts', `Motor ${scriptName} falhou com código de saída: ${code}`);
        reject(new Error(`Falha no motor ${scriptName}`));
      }
    });
  });
}

async function startOrchestration() {
  const args = process.argv.slice(2);
  const theme = args.find(arg => !arg.startsWith('--'));
  const isRealPublish = args.includes('--real');
  
  logInfo('orchestrator.ts', '==================================================');
  logInfo('orchestrator.ts', '🏛️ INICIALIZANDO ORQUESTRADOR HOOKE ELITE LOCAL');
  logInfo('orchestrator.ts', '==================================================');

  try {
    // PASSO 1: Se um tema foi passado, liga o Diretor
    if (theme) {
      logProgress('orchestrator.ts', `[PASSO 1/4] Decupando o tema de campanha: "${theme}"`);
      await runMotor('1-director.ts', [theme]);
    } else {
      logInfo('orchestrator.ts', '[PASSO 1/4] Nenhum tema fornecido. Ignorando Diretor de Arte.');
    }

    // PASSO 2: Rodar o Gerador para criar imagens físicas
    logProgress('orchestrator.ts', '[PASSO 2/4] Gerando imagens gráficas locais...');
    await runMotor('2-generator.ts');

    // PASSO 3: Rodar o Auditor (Tribunal Estético)
    logProgress('orchestrator.ts', '[PASSO 3/4] Iniciando Auditoria Estética e SEO...');
    await runMotor('3-auditor.ts');

    // PASSO 4: Rodar o Publicador (Upload e Firestore)
    logProgress('orchestrator.ts', '[PASSO 4/4] Processando publicações na loja...');
    const publishFlag = isRealPublish ? '--real' : '--mock';
    await runMotor('4-publisher.ts', [publishFlag]);

    logInfo('orchestrator.ts', '==================================================');
    logSuccess('orchestrator.ts', '🎉 PIPELINE DE ORQUESTRAÇÃO DE IA CONCLUÍDO COM SUCESSO!');
    logInfo('orchestrator.ts', '==================================================');

  } catch (error: any) {
    logError('orchestrator.ts', 'Falha crítica durante a orquestração do pipeline.', error);
    process.exit(1);
  }
}

startOrchestration();
