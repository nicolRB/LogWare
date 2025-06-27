import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/lib/firebase";

export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário logado:", user);
    return user;
  } catch (error: unknown) {
    console.error("Erro no login:", error);
    if (error instanceof Error) {
      throw new Error(`Falha no login: ${error.message}`);
    } else if (typeof error === "string") {
      throw new Error(`Falha no login: ${error}`);
    } else {
      throw new Error(`Falha no login: ${String(error)}`);
    }
  }
}
