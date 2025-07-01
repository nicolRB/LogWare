"use client";

import { Typography, Container, Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/usuario-logado`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const userData = await res.json();
            setUserName(userData.name || "Usuário");
          } else {
            console.error("Falha ao carregar dados do usuário:", res.status);
          }
        } catch (error: unknown) {
          console.error("Erro de rede ao carregar dados do usuário:", error);
        }
      }
    };

    fetchUserData();
  }, []);

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
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {`Bem-vindo(a), ${userName}!`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecione uma opção abaixo para gerenciar os relatórios e
          funcionários.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 2 }}
            component={Link}
            href="/employees"
          >
            Gerenciar Funcionários
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ py: 2 }}
            component={Link}
            href="/submitExpense"
          >
            Cadastrar Nova Despesa
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="text"
          color="error"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Sair
        </Button>
      </Box>
    </Container>
  );
}
