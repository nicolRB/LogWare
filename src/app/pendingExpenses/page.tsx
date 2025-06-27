// src/app/pendingExpenses/page.tsx
"use client";

import {useState, useEffect} from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Link from "next/link";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Assumindo uma interface básica para relatórios de despesa
interface ExpenseReport {
  _id: string;
  descricao: string;
  valor: number;
  status: "pendente" | "aprovado" | "rejeitado" | "assinado";
  colaboradorId: string; // ID do colaborador que submeteu
  // Adicione outros campos conforme seu modelo de relatório
}

export default function PendingExpensesPage() {
  const [pendingReports, setPendingReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Para mensagens de sucesso/ação

  useEffect(() => {
    const fetchPendingReports = async () => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Você precisa estar logado para ver relatórios pendentes.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Falha ao carregar relatórios pendentes.");
        }

        const data: ExpenseReport[] = await res.json();
        setPendingReports(data);
      } catch (err: unknown) {
        console.error("Erro ao carregar relatórios pendentes:", err);
        setError(`Erro ao carregar relatórios: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReports();
  }, []);

  // **CORREÇÃO APLICADA AQUI:** Removida ou comentada a função handleValidateClick
  // A navegação já é feita diretamente pelo componente Link do Next.js.
  /*
  const handleValidateClick = (reportId: string) => {
    setMessage(`Navegando para validação do relatório ${reportId}...`);
    // useRouter().push(`/validateExpense?id=${reportId}`);
  };
  */

  if (loading)
    return (
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
        <CircularProgress />
        <Typography sx={{ml: 2}}>Carregando relatórios pendentes...</Typography>
      </Box>
    );

  if (error)
    return (
      <Container maxWidth="md" sx={{mt: 8}}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{mt: 8, p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3}}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
        Relatórios de Despesa Pendentes
      </Typography>

      {message && (
        <Alert severity="info" sx={{mb: 2}}>
          {message}
        </Alert>
      )}

      {pendingReports.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Não há relatórios de despesa pendentes para validação.
        </Typography>
      ) : (
        <List sx={{width: "100%", bgcolor: "background.paper"}}>
          {pendingReports.map((report) => (
            <ListItem key={report._id} divider sx={{"&:hover": {bgcolor: "action.hover"}}}>
              <ListItemText
                primary={`Descrição: ${report.descricao} | Valor: R$ ${report.valor.toFixed(2)}`}
                secondary={`Status: ${report.status} | ID do Colaborador: ${report.colaboradorId}`}
              />
              <ListItemSecondaryAction>
                <Link href={`/validateExpense?id=${report._id}`} passHref legacyBehavior>
                  <Button variant="outlined" color="primary" sx={{mr: 1}}>
                    Validar
                  </Button>
                </Link>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{mt: 4, textAlign: "center"}}>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button variant="text" color="info">
            Voltar ao Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
