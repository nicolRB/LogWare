// src/app/submitExpense/page.tsx
"use client";

import { useState } from "react";
import { enviarRelatorio } from "@/services/relatorioService";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

export default function SubmitExpensePage() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || valor === "") {
      setMensagem("Preencha todos os campos.");
      return;
    }

    try {
      await enviarRelatorio({ descricao, valor: Number(valor) });
      setMensagem("Relatório enviado com sucesso!");
      setDescricao("");
      setValor("");
    } catch (error) {
      setMensagem("Erro ao enviar relatório.");
    }
  };

  return (
    <Container maxWidth="sm" className="py-10">
      <Typography variant="h4" className="mb-6 text-center">
        Submissão de Relatório
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <TextField
          label="Descrição"
          fullWidth
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <TextField
          label="Valor"
          type="number"
          fullWidth
          value={valor}
          onChange={(e) => setValor(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar Relatório
        </Button>
        {mensagem && <Typography color="secondary">{mensagem}</Typography>}
      </Box>
    </Container>
  );
}