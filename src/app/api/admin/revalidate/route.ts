import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * POST /api/admin/revalidate
 * Invalida o cache de produtos após um save pelo Client SDK.
 * Chamado pelo ProductForm após addDoc bem-sucedido.
 */
export async function POST() {
  try {
    // @ts-ignore
    revalidateTag('products');
    revalidatePath('/', 'layout');
    revalidatePath('/admin/produtos');
    revalidatePath('/loja');
    revalidatePath('/produtos');
    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
