/**
 * HOOKE SYSTEM: REVIEWS & UGC SERVICE
 * Lógica de gerenciamento de depoimentos de clientes integrado ao Firebase Firestore.
 */

import { db } from "@/lib/firebase";
import { Review } from "@/types";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";

const REVIEWS_COLLECTION = "reviews";

/**
 * Adiciona uma nova avaliação no Firestore (status aprovado = false por padrão)
 */
export async function addReview(
  reviewData: Omit<Review, "id" | "createdAt" | "approved">
): Promise<{ success: boolean; message: string; id?: string }> {
  if (!db) {
    console.warn("⚠️ [Reviews Service] Firestore indisponível. Simulando adição de review:");
    console.log(reviewData);
    return { success: true, message: "Modo Simulação: Review criada com sucesso." };
  }

  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...reviewData,
      approved: false,
      createdAt: serverTimestamp()
    });
    return { 
      success: true, 
      message: "Avaliação registrada e aguardando moderação.",
      id: docRef.id 
    };
  } catch (error) {
    console.error("🔥 [Reviews Service] Erro ao salvar review no Firestore:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao salvar review." 
    };
  }
}

/**
 * Retorna as avaliações aprovadas de um produto específico
 */
export async function getApprovedReviews(productId: string): Promise<Review[]> {
  if (!db) {
    console.warn("⚠️ [Reviews Service] Firestore indisponível. Retornando array vazio.");
    return [];
  }

  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where("productId", "==", productId),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        productId: data.productId,
        productName: data.productName,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        channel: data.channel || 'site',
        location: data.location || '',
        approved: data.approved,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      });
    });
    return reviews;
  } catch (error) {
    console.error("🔥 [Reviews Service] Erro ao carregar reviews aprovadas:", error);
    return [];
  }
}

/**
 * Retorna TODAS as avaliações (para o painel de moderação /admin)
 */
export async function getAllReviewsForAdmin(): Promise<Review[]> {
  if (!db) {
    console.warn("⚠️ [Reviews Service] Firestore indisponível no admin.");
    return [];
  }

  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        productId: data.productId,
        productName: data.productName,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        channel: data.channel || 'site',
        location: data.location || '',
        approved: data.approved,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      });
    });
    return reviews;
  } catch (error) {
    console.error("🔥 [Reviews Service] Erro ao carregar reviews para o admin:", error);
    return [];
  }
}

/**
 * Aprova uma avaliação para exibição pública
 */
export async function approveReview(reviewId: string): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: "Firestore indisponível." };

  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, { approved: true });
    return { success: true, message: "Avaliação aprovada com sucesso!" };
  } catch (error) {
    console.error("🔥 [Reviews Service] Erro ao aprovar review:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao aprovar review." 
    };
  }
}

/**
 * Exclui permanentemente uma avaliação do Firestore
 */
export async function deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: "Firestore indisponível." };

  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(reviewRef);
    return { success: true, message: "Avaliação deletada com sucesso!" };
  } catch (error) {
    console.error("🔥 [Reviews Service] Erro ao deletar review:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao deletar review." 
    };
  }
}

/**
 * Adiciona uma avaliação manualmente pelo Admin (já aprovada)
 */
export async function addReviewManually(
  reviewData: Omit<Review, "id" | "createdAt" | "approved"> & { approved?: boolean }
): Promise<{ success: boolean; message: string; id?: string }> {
  if (!db) return { success: false, message: "Firestore indisponível." };

  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...reviewData,
      approved: reviewData.approved !== undefined ? reviewData.approved : true,
      createdAt: serverTimestamp()
    });
    return { 
      success: true, 
      message: "Avaliação manual adicionada com sucesso.",
      id: docRef.id 
    };
  } catch (error) {
    console.error("🔥 [Reviews Service] Erro ao adicionar review manual:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro ao adicionar review manual." 
    };
  }
}
