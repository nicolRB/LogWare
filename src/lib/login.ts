import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário logado:", user);
  } catch (error) {
    console.error("Erro no login:", error);
  }
}