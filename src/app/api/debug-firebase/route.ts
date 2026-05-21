import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/index';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        error: 'db is null',
        apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        phase: process.env.NEXT_PHASE
      });
    }

    const q = query(collection(db, 'produtos'), where('department', '==', 'masculino'));
    const snapshot = await getDocs(q);
    
    return NextResponse.json({
      success: true,
      count: snapshot.size,
      docs: snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    });
  } catch (err: any) {
    return NextResponse.json({
      error: 'exception thrown',
      message: err.message,
      stack: err.stack
    });
  }
}
