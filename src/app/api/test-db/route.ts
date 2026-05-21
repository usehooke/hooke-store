import { adminDb } from '@/lib/firebase-admin';
import { ProductSchema } from '@/lib/schemas';
import { Department, Size } from '@/types/enums';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!adminDb) return NextResponse.json({ error: 'No admin DB' }, { status: 500 });
  
  const testProduct = {
    id: `prod-test-${Date.now()}`,
    name: 'Camiseta Teste IA',
    description: 'Criado pela IA para investigar falha de validação',
    price: 99.9,
    imageUrl: '/hero-preta.avif',
    images: ['/hero-preta.avif'],
    sizes: [Size.M, Size.G],
    department: Department.MASCULINO,
    category: 'Camisetas',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    // 1. Testa validação
    const validation = ProductSchema.safeParse(testProduct);
    if (!validation.success) {
      return NextResponse.json({ 
        status: 'Validation Failed before saving', 
        errors: validation.error.format() 
      });
    }

    // 2. Salva no Firebase
    await adminDb.collection('produtos').doc(testProduct.id).set(testProduct);

    // 3. Lê os últimos 5 produtos do banco (incluindo os que o usuário criou que falharam)
    const snap = await adminDb.collection('produtos').orderBy('createdAt', 'desc').limit(5).get();
    const results: any[] = [];
    
    snap.forEach(doc => {
      const data = doc.data();
      const val = ProductSchema.safeParse({ id: doc.id, ...data });
      results.push({
        id: doc.id,
        name: data.name,
        isValid: val.success,
        errors: !val.success ? val.error.format() : null,
        data: data
      });
    });

    return NextResponse.json({
      message: 'Produto de teste inserido',
      validationResults: results
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
