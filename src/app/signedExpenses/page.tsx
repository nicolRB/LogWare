// src/app/signedExpenses/page.tsx
"use client"; // Esta página certamente precisará de Client Components

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
// Importe um ícone se quiser, ex:
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Para indicar verificação

// Reutilizando a interface ExpenseReport ou definindo uma específica para relatórios assinados
interface ExpenseReport {
  _id: string;
  descricao: string;
  valor: number;
  status: "pendente" | "aprovado" | "rejeitado" | "assinado";
  colaboradorId: string;
  // Adicione campos de assinatura se já tiver definido no modelo de backend
  // signatureId?: string; // ID da assinatura digital associada
  // publicKeyUsed?: string; // Chave pública usada (pode ser JWK string)
  // signedAt?: string; // Data da assinatura
}

export default function SignedExpensesPage() {
  const [signedReports, setSignedReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Para mensagens de feedback

  useEffect(() => {
    const fetchSignedReports = async () => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        // **Implemente a chamada para sua API de backend para listar relatórios assinados.**
        // Você precisará de um endpoint no backend que retorne relatórios com status 'assinado'.
        // O diretor precisará de autenticação (JWT) e verificação de role.
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Você precisa estar logado para ver relatórios assinados.");
          // Opcional: router.push('/login');
          setLoading(false);
          return;
        }

        // Exemplo: Substitua '/api/reports/signed' pela sua rota real
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/signed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Falha ao carregar relatórios assinados.");
        }

        const data: ExpenseReport[] = await res.json();
        setSignedReports(data);
      } catch (err: unknown) {
        console.error("Erro ao carregar relatórios assinados:", err);
        setError(`Erro ao carregar relatórios: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSignedReports();
  }, []);

  if (loading)
    return (
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
        <CircularProgress />
        <Typography sx={{ml: 2}}>Carregando relatórios assinados...</Typography>
      </Box>
    );

  if (error)
    return (
      <Container maxWidth="md" sx={{mt: 8}}>
        <Alert severity="error">{error}</Alert>
        {/* <Button onClick={() => router.back()} sx={{ mt: 2 }}>Voltar</Button> */}
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{mt: 8, p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3}}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
        Relatórios de Despesa Assinados
      </Typography>

      {message && (
        <Alert severity="info" sx={{mb: 2}}>
          {message}
        </Alert>
      )}

      {signedReports.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Não há relatórios de despesa assinados para verificação.
        </Typography>
      ) : (
        <List sx={{width: "100%", bgcolor: "background.paper"}}>
          {signedReports.map((report) => (
            <ListItem key={report._id} divider sx={{"&:hover": {bgcolor: "action.hover"}}}>
              <ListItemText
                primary={`Descrição: ${report.descricao} | Valor: R$ ${report.valor?.toFixed(2)}`}
                secondary={`Status: ${report.status} | Colaborador: ${report.colaboradorId}`}
                // Você pode adicionar mais detalhes da assinatura aqui
              />
              <ListItemSecondaryAction>
                {/* Link para a página de verificação de assinatura individual do relatório */}
                <Link href={`/verifySignature?id=${report._id}`} passHref legacyBehavior>
                  <Button variant="contained" color="primary" sx={{mr: 1}}>
                    Verificar Assinatura
                  </Button>
                </Link>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Exemplo de botão de volta para o Dashboard */}
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
