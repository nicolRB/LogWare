// src/services/relatorioService.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function enviarRelatorio(relatorio: { descricao: string; valor: number }) {
  try {
    const docRef = await addDoc(collection(db, "relatorios"), {
      ...relatorio,
      enviadoEm: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao enviar relatório:", error);
    throw error;
  }
}