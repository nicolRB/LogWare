"use client";
import {Suspense, useState, useEffect} from "react";
import {Container, Typography, Box, Button, CircularProgress, Alert, Paper, TextField} from "@mui/material";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SignExpensePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignExpenseContent />
    </Suspense>
  );
}

interface ExpenseReport {
  _id: string;
  descricao: string;
  valor: number;
  status: "pendente" | "aprovado" | "rejeitado" | "assinado";
  colaboradorId: string;
  signature?: string;
  publicKey?: JsonWebKey;
  signedHash?: string;
}

function SignExpenseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<ExpenseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

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
          setError("Você precisa estar logado para assinar relatórios.");
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
          throw new Error(errorData.message || "Falha ao carregar detalhes do relatório.");
        }

        const data: ExpenseReport = await res.json();
        if (data.status !== "aprovado") {
          setError(`Relatório não está no status 'aprovado'. Status atual: ${data.status}`);
          setLoading(false);
          return;
        }
        setReport(data);
      } catch (err: unknown) {
        console.error("Erro ao carregar ou verificar relatório:", err);
        setError(`Erro: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [reportId, router]);

  const handleSignReport = async () => {
    setMessage("");
    setError("");
    if (!report) {
      setError("Nenhum relatório para assinar.");
      return;
    }

    try {
      const reportContent = JSON.stringify(report);
      const dataToSign = new TextEncoder().encode(reportContent);

      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );

      const signatureBuffer = await window.crypto.subtle.sign({name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"}, keyPair.privateKey, dataToSign);
      const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
      setSignature(base64Signature);

      const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
      const token = localStorage.getItem("token");

      const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataToSign);
      const signedHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

      const signRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          signature: base64Signature,
          publicKey: publicKeyJwk,
          signedHash: signedHash,
        }),
      });

      if (!signRes.ok) {
        const errorData = await signRes.json();
        throw new Error(errorData.message || "Falha ao registrar assinatura no backend.");
      }

      setMessage("Relatório assinado digitalmente com sucesso!");
    } catch (err: unknown) {
      console.error("Erro ao assinar relatório:", err);
      setError(`Erro ao assinar: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (loading)
    return (
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
        <CircularProgress />
        <Typography sx={{ml: 2}}>Carregando detalhes do relatório...</Typography>
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
        <Alert severity="warning">Relatório não encontrado ou inválido para assinatura.</Alert>
        <Button onClick={() => router.back()} sx={{mt: 2}}>
          Voltar
        </Button>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{mt: 8, p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3}}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
        Assinar Relatório de Despesa
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
          <strong>Status:</strong> {report.status}
        </Typography>
      </Paper>

      {!signature ? (
        <Box sx={{textAlign: "center"}}>
          <Button variant="contained" color="primary" onClick={handleSignReport} sx={{py: 2, px: 5}} disabled={loading}>
            Assinar Digitalmente
          </Button>
        </Box>
      ) : (
        <Box sx={{mt: 4}}>
          <Typography variant="h6" gutterBottom>
            Assinatura Gerada:
          </Typography>
          <TextField fullWidth multiline rows={5} value={signature} variant="outlined" InputProps={{readOnly: true}} sx={{mb: 2}} />
          <Typography variant="caption" color="text.secondary">
            Esta é a assinatura digital do relatório. Ela foi enviada ao backend para registro.
          </Typography>
        </Box>
      )}

      <Box sx={{mt: 4, textAlign: "center"}}>
        <Button variant="text" color="info" onClick={() => router.back()}>
          Voltar
        </Button>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button variant="text" color="info" sx={{ml: 2}}>
            Ir para Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
