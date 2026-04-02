import { NextResponse } from "next/server";
import { collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
  // Simple check to prevent accidental runs, can pass ?confirm=true
  const { searchParams } = new URL(req.url);
  const confirm = searchParams.get("confirm");

  if (confirm !== "true") {
    return NextResponse.json({ message: "Pass ?confirm=true to execute the purge." }, { status: 400 });
  }

  let deletedPedidos = 0;
  let updatedProdutos = 0;

  // ⚡ A TRAVA DO TECH LEAD: Se o banco estiver offline (Build/No Keys), abortamos.
  const firestore = db;
  if (!firestore) {
      console.error("❌ [Hooke System] Purge abortado: Firestore offline.");
      return NextResponse.json({ error: "[Hooke System] Service Unavailable" }, { status: 503 });
  }

  try {
    const pedidosRef = collection(firestore, "pedidos");
    const pedidosSnapshot = await getDocs(pedidosRef);

    for (const docSnapshot of pedidosSnapshot.docs) {
      const data = docSnapshot.data();
      if (
        data.is_test === true || 
        (data.customer && data.customer.email && data.customer.email.endsWith("@test.com")) ||
        (data.customer && data.customer.email && data.customer.email.includes("teste"))
      ) {
        await deleteDoc(docSnapshot.ref);
        deletedPedidos++;
      }
    }
  } catch (err) {
    console.error("Error purging test orders:", err);
    return NextResponse.json({ error: "Failed to purge orders", details: err }, { status: 500 });
  }

  try {
    const produtosRef = collection(firestore, "produtos");
    const produtosSnapshot = await getDocs(produtosRef);

    for (const docSnapshot of produtosSnapshot.docs) {
      const data = docSnapshot.data();
      const updates: Record<string, number> = {};
      if (data.views) updates.views = 0;
      if (data.clicks) updates.clicks = 0;
      if (data.sales) updates.sales = 0;

      if (Object.keys(updates).length > 0) {
        await updateDoc(docSnapshot.ref, updates);
        updatedProdutos++;
      }
    }
  } catch (err) {
     console.error("Error resetting product analytics:", err);
     return NextResponse.json({ error: "Failed to reset products", details: err }, { status: 500 });
  }

  return NextResponse.json({
    message: "Data Purge Completed.",
    deletedPedidos,
    updatedProdutos
  }, { status: 200 });
}
