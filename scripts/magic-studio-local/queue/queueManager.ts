import fs from 'fs';
import path from 'path';

const QUEUE_FILE = path.join(__dirname, '..', 'queue', 'studio-queue.json');

export type TransactionStatus = 'pending' | 'local_rendered' | 'audited' | 'queued_upload' | 'uploaded' | 'completed' | 'failed_retry';

export interface QueueItem {
  id: string;
  theme: string;
  status: TransactionStatus;
  localFilePath?: string;
  metadata?: any;
  firebaseUrl?: string;
  logs: string[];
}

export function readQueue(): { transactions: QueueItem[] } {
  if (!fs.existsSync(QUEUE_FILE)) {
    return { transactions: [] };
  }
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
}

export function writeQueue(data: { transactions: QueueItem[] }) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
}

export function updateTransaction(id: string, updates: Partial<QueueItem>, logMessage?: string) {
  const queue = readQueue();
  const index = queue.transactions.findIndex(t => t.id === id);
  
  if (index !== -1) {
    queue.transactions[index] = { ...queue.transactions[index], ...updates };
    if (logMessage) {
      queue.transactions[index].logs.push(`[${new Date().toISOString()}] ${logMessage}`);
    }
    writeQueue(queue);
  }
}

export function createTransaction(item: Omit<QueueItem, 'logs'>) {
  const queue = readQueue();
  queue.transactions.push({ ...item, logs: [`[${new Date().toISOString()}] Transação criada`] });
  writeQueue(queue);
}
