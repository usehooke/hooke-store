import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StubPublisher } from '../adapters/publisher';
import { validatePreUpload, LocalMetadata } from '../utils/validator';
import { createTransaction, readQueue, updateTransaction } from '../queue/queueManager';
import fs from 'fs';
import path from 'path';

// Arquivo temporário falso para o teste físico
const dummyImagePath = path.join(__dirname, '..', '..', '..', 'public', 'studio-outputs', 'test-mock.jpg');
const dummyId = 'test-uuid-001';

describe('Estúdio Mágico - Transação Resiliente de Upload (Stub)', () => {

  beforeEach(() => {
    // 1. Limpa a Fila antes de testar
    fs.writeFileSync(path.join(__dirname, '..', 'queue', 'studio-queue.json'), JSON.stringify({ transactions: [] }));
    // 2. Garante que o arquivo físico falso existe para o validador passar
    if (!fs.existsSync(path.dirname(dummyImagePath))) fs.mkdirSync(path.dirname(dummyImagePath), { recursive: true });
    fs.writeFileSync(dummyImagePath, 'dummy data webp');
  });

  it('deve validar, rodar o stub de upload e atualizar a fila perfeitamente sem bater no Firebase real', async () => {
    
    // SETUP: Metadados válidos que passarão no Zod
    const validMetadata: LocalMetadata = {
      title: "T-Shirt Minimalista",
      luxuryDescription: "Uma copy absurdamente luxuosa descrevendo as amarras e a etiqueta Woven da Hooke.",
      suggestedPrice: 199.00,
      category: "Essenciais",
      fabric: "Algodão Pima",
      model: "Boxy",
      seoKeywords: ["minimalista", "boxy", "luxo", "hooke"]
    };

    // 1. Criamos a transação na fila (Estado: queued_upload)
    createTransaction({
      id: dummyId,
      theme: "Teste Unitário",
      status: "queued_upload",
      localFilePath: "public/studio-outputs/test-mock.jpg",
      metadata: validMetadata
    });

    // 2. Invocamos o Validador
    const validation = await validatePreUpload("public/studio-outputs/test-mock.jpg", validMetadata);
    expect(validation.success).toBe(true);

    // 3. Executamos o STUB Publisher (O Mágico sem DB)
    const publisher = new StubPublisher();
    
    // Upload da Imagem Mockada
    const fakeUrl = await publisher.uploadImage(dummyImagePath, dummyId);
    expect(fakeUrl).toContain('https://firebasestorage.googleapis.com');
    updateTransaction(dummyId, { status: "uploaded", firebaseUrl: fakeUrl }, "Upload finalizado via Stub.");

    // Gravação Mockada no BD
    const success = await publisher.createProductRecord(dummyId, validMetadata, fakeUrl);
    expect(success).toBe(true);
    updateTransaction(dummyId, { status: "completed" }, "Produto cadastrado com sucesso via Stub.");

    // 4. Verificação Final da Fila Resiliente
    const finalQueue = readQueue();
    const transaction = finalQueue.transactions.find(t => t.id === dummyId);
    
    expect(transaction).toBeDefined();
    expect(transaction?.status).toBe("completed");
    expect(transaction?.firebaseUrl).toBe(fakeUrl);
    expect(transaction?.logs.length).toBeGreaterThan(2); // Verifica se guardou o histórico inteiro
  });
});
