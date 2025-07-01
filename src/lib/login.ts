// src/lib/login.ts
import { signInWithEmailAndPassword } from "firebase/auth"; // Apenas o 'User' foi removido daqui
import { auth } from "@/lib/firebase";

export async function login(email: string, password: string): Promise<string> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Ponto crucial: Obter o token JWT do utilizador
    const token = await user.getIdToken();

    console.log("Utilizador logado com sucesso.");

    // Retornar o token em vez do objeto do utilizador
    return token;
  } catch (error: unknown) {
    console.error("Erro na biblioteca de login:", error);
    if (error instanceof Error) {
      if (error.message.includes("auth/invalid-credential")) {
        throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
      }
      throw new Error(`Falha no login: ${error.message}`);
    }
    throw new Error("Ocorreu um erro desconhecido durante o login.");
  }
}
