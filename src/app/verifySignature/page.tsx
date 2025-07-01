"use client";

import {Suspense, useState, useEffect} from "react";
import {Container, Typography, Box, Button, CircularProgress, Alert, Paper, TextField} from "@mui/material";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ExpenseReport {
  _id: string;
  descricao: string;
  valor: number;
  status: "pendente" | "aprovado" | "rejeitado" | "assinado";
  signature?: string;
  publicKey?: JsonWebKey;
  signedHash?: string;
}

// 👉 O componente separado que usa `useSearchParams`
function VerifySignatureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<ExpenseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"pendente" | "valida" | "invalida" | null>(null);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    const fetchReportAndVerify = async () => {
      if (!reportId) {
        setError("ID do relatório não fornecido.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setVerificationStatus(null);
      setVerificationMessage("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Você precisa estar logado para verificar assinaturas.");
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
          throw new Error(errorData.message || "Falha ao carregar detalhes do relatório para verificação.");
        }

        const data: ExpenseReport = await res.json();
        if (data.status !== "assinado" || !data.signature || !data.publicKey) {
          setError("Relatório não está assinado ou faltam dados da assinatura.");
          setLoading(false);
          return;
        }
        setReport(data);
        await performVerification(data);
      } catch (err: unknown) {
        console.error("Erro ao carregar ou verificar relatório:", err);
        setError(`Erro: ${err instanceof Error ? err.message : String(err)}`);
        setVerificationStatus("invalida");
        setVerificationMessage("Falha no processo de verificação devido a um erro.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportAndVerify();
  }, [reportId, router]);

  const performVerification = async (reportToVerify: ExpenseReport) => {
    try {
      if (!reportToVerify.signature || !reportToVerify.publicKey || !reportToVerify.signedHash) {
        setVerificationStatus("invalida");
        setVerificationMessage("Dados de assinatura incompletos.");
        return;
      }

      const signatureBuffer = Uint8Array.from(atob(reportToVerify.signature), (c) => c.charCodeAt(0));
      const publicKey = await window.crypto.subtle.importKey(
        "jwk",
        reportToVerify.publicKey,
        {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"},
        false,
        ["verify"]
      );

      const originalContentHashBuffer = Uint8Array.from(atob(reportToVerify.signedHash), (c) => c.charCodeAt(0));

      const isValid = await window.crypto.subtle.verify(
        {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"},
        publicKey,
        signatureBuffer,
        originalContentHashBuffer
      );

      if (isValid) {
        setVerificationStatus("valida");
        setVerificationMessage("Assinatura Digital VÁLIDA: A integridade e autenticidade do documento foram confirmadas.");
      } else {
        setVerificationStatus("invalida");
        setVerificationMessage("Assinatura Digital INVÁLIDA: O documento foi alterado ou a assinatura é falsa.");
      }
    } catch (err: unknown) {
      console.error("Erro durante a verificação criptográfica:", err);
      setVerificationStatus("invalida");
      setVerificationMessage(`Erro interno na verificação: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (loading)
    return (
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
        <CircularProgress />
        <Typography sx={{ml: 2}}>Carregando e verificando assinatura...</Typography>
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
        <Alert severity="warning">Relatório não encontrado ou sem dados de assinatura.</Alert>
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
        Verificar Assinatura Digital
      </Typography>

      {verificationStatus && (
        <Alert severity={verificationStatus === "valida" ? "success" : "error"} sx={{mb: 2}}>
          {verificationMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
      )}

      <Paper elevation={1} sx={{p: 3, mb: 4}}>
        <Typography variant="h6" gutterBottom>
          Detalhes do Relatório Assinado:
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
          <strong>Status:</strong> {report.status}
        </Typography>
        {report.signature && (
          <Box sx={{mt: 2}}>
            <Typography variant="body2">
              <strong>Assinatura:</strong>
            </Typography>
            <TextField fullWidth multiline rows={5} value={report.signature} variant="outlined" InputProps={{readOnly: true}} />
          </Box>
        )}
        {report.publicKey && (
          <Box sx={{mt: 2}}>
            <Typography variant="body2">
              <strong>Chave Pública (JWK):</strong>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={JSON.stringify(report.publicKey, null, 2)}
              variant="outlined"
              InputProps={{readOnly: true}}
            />
          </Box>
        )}
      </Paper>

      <Box sx={{mt: 4, textAlign: "center"}}>
        <Button variant="text" color="info" onClick={() => router.back()}>
          Voltar
        </Button>
        <Link href="/signedExpenses" passHref legacyBehavior>
          <Button variant="text" color="info" sx={{ml: 2}}>
            Ver Todos Assinados
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

export default function VerifySignaturePage() {
  return (
    <Suspense fallback={<div>Carregando verificação...</div>}>
      <VerifySignatureContent />
    </Suspense>
  );
}
