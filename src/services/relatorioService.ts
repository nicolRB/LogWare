// src/services/relatorioService.ts
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function enviarRelatorio(relatorio: any) {
  try {
    const docRef = await addDoc(collection(db, "relatorios"), relatorio);
    console.log("Relatório enviado com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao enviar relatório:", error);
    throw error;
  }
}