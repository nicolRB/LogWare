"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { login } from "@/lib/login";
import Cookies from "js-cookie"; // Importa a biblioteca de cookies

export default function LoginPage() {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const token = await login(email, password);

      // Salva o token em um cookie que expira em 1 dia
      Cookies.set("token", token, { expires: 1 });

      // Você ainda pode manter no localStorage se outras partes do app usarem
      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Erro no processo de login na página:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro inesperado ao fazer login.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          mt={2}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
