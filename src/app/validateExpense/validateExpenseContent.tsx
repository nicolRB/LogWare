"use client";

import {useState, useEffect} from "react";
import {Container, Typography, Box, Button, CircularProgress, Alert, Paper} from "@mui/material";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";

interface ExpenseReport {
  _id: string;
  descricao: string;
  valor: number;
  status: "pendente" | "aprovado" | "rejeitado" | "assinado";
  colaboradorId: string;
}

export default function ValidateExpenseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<ExpenseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!reportId) {
        setError("ID do relatório não fornecido.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setMessage("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Você precisa estar logado para validar relatórios.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Falha ao carregar detalhes do relatório para validação.");
        }

        const data: ExpenseReport = await res.json();
        setReport(data);
      } catch (err: unknown) {
        console.error("Erro ao carregar detalhes do relatório:", err);
        setError(`Erro ao carregar relatório: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [reportId, router]);

  const handleApprove = async () => {
    setMessage("");
    setError("");
    if (!report) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${report._id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({status: "aprovado"}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao aprovar relatório.");
      }

      setReport({...report, status: "aprovado"});
      setMessage("Relatório aprovado com sucesso! Agora pode ser assinado.");
    } catch (err: unknown) {
      console.error("Erro ao aprovar relatório:", err);
      setError(`Erro ao aprovar: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleReject = async () => {
    setMessage("");
    setError("");
    if (!report) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${report._id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({status: "rejeitado"}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao rejeitar relatório.");
      }

      setReport({...report, status: "rejeitado"});
      setMessage("Relatório rejeitado.");
    } catch (err: unknown) {
      console.error("Erro ao rejeitar relatório:", err);
      setError(`Erro ao rejeitar: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ml: 2}}>Carregando detalhes do relatório para validação...</Typography>
      </Box>
    );

  if (error)
    return (
      <Container maxWidth="md" sx={{mt: 8}}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => router.back()} sx={{mt: 2}}>
          Voltar
        </Button>
      </Container>
    );

  if (!report)
    return (
      <Container maxWidth="md" sx={{mt: 8}}>
        <Alert severity="warning">Relatório não encontrado ou inválido para validação.</Alert>
        <Button onClick={() => router.back()} sx={{mt: 2}}>
          Voltar
        </Button>
      </Container>
    );

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 8,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
        Visualizar e Validar Relatório
      </Typography>

      {message && (
        <Alert severity="success" sx={{mb: 2}}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
      )}

      <Paper elevation={1} sx={{p: 3, mb: 4}}>
        <Typography variant="h6" gutterBottom>
          Detalhes do Relatório:
        </Typography>
        <Typography>
          <strong>ID:</strong> {report._id}
        </Typography>
        <Typography>
          <strong>Descrição:</strong> {report.descricao}
        </Typography>
        <Typography>
          <strong>Valor:</strong> R$ {report.valor?.toFixed(2)}
        </Typography>
        <Typography>
          <strong>Status Atual:</strong> {report.status}
        </Typography>
        <Typography>
          <strong>Submetido por (ID):</strong> {report.colaboradorId}
        </Typography>
      </Paper>

      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {report.status === "pendente" && (
          <>
            <Button variant="contained" color="success" onClick={handleApprove}>
              Aprovar
            </Button>
            <Button variant="contained" color="error" onClick={handleReject}>
              Rejeitar
            </Button>
          </>
        )}
        {report.status === "aprovado" && (
          <Link href={`/signExpense?id=${report._id}`} passHref legacyBehavior>
            <Button variant="contained" color="primary">
              Ir para Assinatura Digital
            </Button>
          </Link>
        )}
        {(report.status === "rejeitado" || report.status === "assinado") && (
          <Typography color="text.secondary">Relatório já {report.status === "rejeitado" ? "rejeitado" : "assinado"}.</Typography>
        )}
      </Box>

      <Box sx={{mt: 4, textAlign: "center"}}>
        <Button variant="text" color="info" onClick={() => router.back()}>
          Voltar
        </Button>
        <Link href="/pendingExpenses" passHref legacyBehavior>
          <Button variant="text" color="info" sx={{ml: 2}}>
            Ver Todos Pendentes
          </Button>
        </Link>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button variant="text" color="info" sx={{ml: 2}}>
            Ir para Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
