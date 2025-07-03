"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import Link from "next/link";

export default function SubmitExpensePage() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    setError("");
    setLoading(true);

    if (!descricao || valor === "") {
      setError("Por favor, preencha a descrição e o valor do relatório.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você não está autenticado. Por favor, faça o login novamente.");
      setLoading(false);
      return;
    }

    try {
      // Faz a requisição para a API do backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envia o token para autenticação
          },
          body: JSON.stringify({
            descricao,
            valor: Number(valor),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao enviar relatório.");
      }

      setMensagem("Relatório de despesa enviado com sucesso!");
      setDescricao("");
      setValor("");
    } catch (err: unknown) {
      console.error("Erro ao tentar enviar o relatório:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(`Erro na submissão: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5, mt: 8 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Submissão de Relatório de Despesa
      </Typography>

      {mensagem && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {mensagem}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: "8px",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          label="Descrição da Despesa"
          fullWidth
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <TextField
          label="Valor da Despesa"
          type="number"
          fullWidth
          value={valor}
          onChange={(e) =>
            setValor(e.target.value === "" ? "" : Number(e.target.value))
          }
          inputProps={{ step: "0.01" }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Relatório"}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button variant="text" color="info">
            Voltar ao Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
