"use client";

import {useState} from "react";
import {enviarRelatorio} from "@/services/relatorioService";
import {TextField, Button, Container, Typography, Box} from "@mui/material";

export default function SubmitExpensePage() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    if (!descricao || valor === "") {
      setMensagem("Por favor, preencha a descrição e o valor do relatório.");
      return;
    }

    try {
      await enviarRelatorio({descricao, valor: Number(valor)});
      setMensagem("Relatório de despesa enviado com sucesso!");
      setDescricao("");
      setValor("");
    } catch (error: unknown) {
      console.error("Erro ao tentar enviar o relatório:", error);

      let errorMessageForUser = "Erro ao enviar relatório. Tente novamente.";

      if (error instanceof Error) {
        errorMessageForUser = `Erro na submissão: ${error.message}`;
      } else if (typeof error === "string") {
        errorMessageForUser = `Erro na submissão: ${error}`;
      } else {
        errorMessageForUser = `Erro na submissão: ${String(error)}`;
      }

      setMensagem(errorMessageForUser);
    }
  };

  return (
    <Container maxWidth="sm" sx={{py: 5, mt: 8}}>
      {" "}
      {/* Use 'sx' para estilos MUI */}
      <Typography variant="h4" component="h1" sx={{mb: 3, textAlign: "center"}}>
        Submissão de Relatório de Despesa
      </Typography>
      {/* Exibição de mensagens (sucesso ou erro) */}
      {mensagem && (
        <Typography color={mensagem.includes("sucesso") ? "primary" : "error"} sx={{mb: 2, textAlign: "center"}}>
          {mensagem}
        </Typography>
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
        <TextField label="Descrição da Despesa" fullWidth value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <TextField
          label="Valor da Despesa"
          type="number"
          fullWidth
          value={valor}
          onChange={(e) => setValor(e.target.value === "" ? "" : Number(e.target.value))}
          inputProps={{step: "0.01"}}
          required
        />
        {/* Futuramente, você pode adicionar um campo para upload de recibos aqui */}
        {/* <input type="file" onChange={handleFileChange} /> */}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar Relatório
        </Button>
      </Box>
    </Container>
  );
}
