import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * Hooke V15.0: THE NUKE ROUTE
 * Rota tática para purga forçada de cache na borda (Edge).
 * Use esta rota quando o Data Cache da Vercel estiver "congelado" com dados órfãos.
 */
export async function GET() {
  try {
    // ESSA É A NOVA MARRETA (FORA DO RENDER): 
    // Ele destrói o cache global da Home e do Layout na borda.
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ 
      success: true,
      message: 'Global Cache Purged Atomics. Hooke V15.0 Cleaned.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
