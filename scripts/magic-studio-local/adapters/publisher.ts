import { LocalMetadata } from '../utils/validator';
import { logInfo, logSuccess, logError } from '../utils/logger';
import { adminDb, adminStorage } from './firebase-local';
import fs from 'fs';
import path from 'path';

export interface IPublisher {
  uploadImage(localPath: string, id: string): Promise<string>;
  createProductRecord(id: string, metadata: LocalMetadata, imageUrl: string): Promise<boolean>;
}

// O STUB (Simulador Perfeito para Testes Unitários)
export class StubPublisher implements IPublisher {
  public async uploadImage(localPath: string, id: string): Promise<string> {
    logInfo('StubPublisher', `[MOCK] Simulando upload de ${localPath}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const fakeUrl = `https://firebasestorage.googleapis.com/v0/b/mock/o/studio%2F${id}.webp?alt=media`;
    logSuccess('StubPublisher', `[MOCK] Imagem upada com sucesso! URL: ${fakeUrl}`);
    return fakeUrl;
  }

  public async createProductRecord(id: string, metadata: LocalMetadata, imageUrl: string): Promise<boolean> {
    logInfo('StubPublisher', `[MOCK] Simulando gravação do produto "${metadata.title}" no Firestore...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    logSuccess('StubPublisher', `[MOCK] Produto ID ${id} cadastrado na loja.`);
    return true;
  }
}

// O PUBLICADOR REAL (Firebase Admin)
export class RealFirebasePublisher implements IPublisher {
  
  // Decide se usa o ambiente de teste com base na flag do terminal
  private getCollectionName(): string {
    const isTestMode = process.env.STUDIO_TEST_MODE === 'true';
    const collection = isTestMode ? 'products_test' : 'products';
    logInfo('RealFirebasePublisher', `[REAL] Operando na coleção do Firestore: "${collection}"`);
    return collection;
  }

  public async uploadImage(localPath: string, id: string): Promise<string> {
    logInfo('RealFirebasePublisher', `[REAL] Iniciando upload físico da imagem ${id}...`);
    
    try {
      const absolutePath = path.resolve(process.cwd(), localPath);
      const destinationPath = `magic-studio-uploads/${id}${path.extname(absolutePath)}`;
      
      const [file] = await adminStorage.upload(absolutePath, {
        destination: destinationPath,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        }
      });

      // Transforma a URL em pública
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${file.name}`;
      
      logSuccess('RealFirebasePublisher', `[REAL] Upload concluído! URL Pública: ${publicUrl}`);
      return publicUrl;
      
    } catch (error: any) {
      logError('RealFirebasePublisher', `[REAL] Falha no upload para o Storage.`, error);
      throw error; // Lança o erro para que a Fila marque como failed_retry
    }
  }

  public async createProductRecord(id: string, metadata: LocalMetadata, imageUrl: string): Promise<boolean> {
    logInfo('RealFirebasePublisher', `[REAL] Gravando produto "${metadata.title}" no Firestore...`);
    
    try {
      const collection = this.getCollectionName();
      
      await adminDb.collection(collection).doc(id).set({
        title: metadata.title,
        description: metadata.luxuryDescription,
        price: metadata.suggestedPrice,
        category: metadata.category,
        fabric: metadata.fabric,
        model: metadata.model,
        images: [imageUrl], // Array de imagens padrão da sua loja
        seoKeywords: metadata.seoKeywords,
        magicStudioGenerated: true,
        createdAt: new Date().toISOString(),
        status: "active"
      });

      logSuccess('RealFirebasePublisher', `[REAL] Produto salvo com sucesso na coleção ${collection}.`);
      return true;
    } catch (error: any) {
      logError('RealFirebasePublisher', `[REAL] Falha na gravação do Firestore.`, error);
      throw error;
    }
  }
}
