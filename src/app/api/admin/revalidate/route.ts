import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * POST /api/admin/revalidate
 * Invalida o cache de produtos após um save pelo Client SDK.
 * Chamado pelo ProductForm após addDoc bem-sucedido.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Invalida o catálogo inteiro
    // @ts-ignore
    revalidateTag('products');

    // Se houver slug específico, invalida a tag dele
    if (body.slug) {
        // @ts-ignore
        revalidateTag(`product-${body.slug}`);
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/produtos');
    revalidatePath('/loja');
    revalidatePath('/produtos');
    
    if (body.slug) {
      revalidatePath(`/produto/${body.slug}`);
    }

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
