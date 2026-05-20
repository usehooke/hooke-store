export function logInfo(context: string, message: string) {
  console.log(`[${new Date().toISOString()}] [INFO] [${context}] ${message}`);
}

export function logProgress(context: string, message: string) {
  console.log(`[${new Date().toISOString()}] [PROGRESS] [${context}] ⏳ ${message}`);
}

export function logSuccess(context: string, message: string) {
  console.log(`[${new Date().toISOString()}] [SUCCESS] [${context}] ✅ ${message}`);
}

export function logValid(context: string, message: string) {
  console.log(`[${new Date().toISOString()}] [VALID] [${context}] 🛡️ ${message}`);
}

export function logError(context: string, message: string, error?: any) {
  console.error(`[${new Date().toISOString()}] [ERROR] [${context}] ❌ ${message}`);
  if (error) {
    console.error(error);
  }
}
