import { readQueue, updateTransaction } from './queue/queueManager.js';
import { logInfo, logSuccess, logError, logProgress } from './utils/logger.js';
import { RealFirebasePublisher, StubPublisher, IPublisher } from './adapters/publisher.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runPublisher() {
  logInfo('4-publisher.ts', 'Iniciando varredura de transações prontas para publicação...');
  
  // Captura argumentos da linha de comando: npx tsx 4-publisher.ts --real ou --mock
  const args = process.argv.slice(2);
  const isReal = args.includes('--real');
  const isMock = args.includes('--mock');
  
  if (!isReal && !isMock) {
    logError('4-publisher.ts', 'Defina a flag de execução: --real (Firebase Real) ou --mock (Simulador de Teste).');
    process.exit(1);
  }

  // Injeção de Dependência Dinâmica baseada em Flags
  let publisher: IPublisher;
  if (isReal) {
    logInfo('4-publisher.ts', '[REAL] Utilizando Publicador Físico do Firebase Admin.');
    publisher = new RealFirebasePublisher();
  } else {
    logInfo('4-publisher.ts', '[MOCK] Utilizando Simulador de Testes (Stub).');
    publisher = new StubPublisher();
  }

  const queue = readQueue();
  const uploadableTasks = queue.transactions.filter(t => t.status === 'queued_upload');
  
  if (uploadableTasks.length === 0) {
    logSuccess('4-publisher.ts', 'Nenhum produto pendente de upload na fila.');
    return;
  }

  logInfo('4-publisher.ts', `Encontrados ${uploadableTasks.length} produtos qualificados.`);

  for (const task of uploadableTasks) {
    try {
      if (!task.localFilePath) {
        throw new Error('Arquivo físico local da imagem ausente.');
      }

      logProgress('4-publisher.ts', `Processando produto: "${task.metadata.title}" [ID: ${task.id}]`);

      // Passo 1: Upload físico da imagem
      const uploadedUrl = await publisher.uploadImage(task.localFilePath, task.id);
      
      updateTransaction(
        task.id, 
        { firebaseUrl: uploadedUrl, status: 'uploaded' }, 
        `Imagem hospedada com sucesso. URL: ${uploadedUrl}`
      );

      // Passo 2: Gravação da ficha cadastral de SEO no Firestore
      const dbSuccess = await publisher.createProductRecord(task.id, task.metadata, uploadedUrl);
      
      if (dbSuccess) {
        updateTransaction(
          task.id, 
          { status: 'completed' }, 
          `Publicação finalizada com absoluto sucesso. Pronto para vendas.`
        );
        logSuccess('4-publisher.ts', `Produto "${task.metadata.title}" publicado na loja e marcado como [completed].`);
      }

    } catch (error: any) {
      logError('4-publisher.ts', `Falha crítica ao publicar produto ${task.id}`, error);
      // Mantém na fila para re-tentativa posterior
      updateTransaction(
        task.id, 
        { status: 'failed_retry' }, 
        `Erro de publicação: ${error.message}. Entrando em estado de re-tentativa.`
      );
    }
  }

  logSuccess('4-publisher.ts', 'Processamento de fila de publicação concluído.');
}

runPublisher();
