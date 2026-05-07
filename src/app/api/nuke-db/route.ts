import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function GET() {
  if (!db) return NextResponse.json({ error: "DB não inicializado" });

  try {
    const colRef = collection(db, "produtos");
    const snapshot = await getDocs(colRef);
    let count = 0;
    
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, "produtos", d.id));
      count++;
    }

    return NextResponse.json({ success: true, deleted: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
