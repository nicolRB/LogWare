"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Container, TextField, Button, Typography, Box, Paper} from "@mui/material";
import {login} from "@/lib/login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Erro no processo de login na página:", err);
      let errorMessage = "Erro inesperado ao fazer login.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = String(err);
      }
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{p: 4, mt: 8}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField label="E-mail" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Entrar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
