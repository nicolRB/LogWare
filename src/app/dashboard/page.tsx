"use client";

import { Typography, Container, Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Usuário");
  const [userRole, setUserRole] = useState(""); // Estado para guardar o cargo do utilizador

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token") || localStorage.getItem("token");

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
            setUserRole(userData.role || ""); // Guarda o cargo no estado
          } else {
            console.error("Falha ao carregar dados do usuário:", res.status);
            Cookies.remove("token");
            localStorage.removeItem("token");
            window.location.href = "/login";
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
          funcionários. (Cargo: {userRole})
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {/* Botão visível para todos os cargos */}
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

        {/* Botões visíveis apenas para o Diretor */}
        {userRole === "diretor" && (
          <>
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
          </>
        )}

        {/* Botões visíveis para Gerente e Diretor */}
        {(userRole === "gerente" || userRole === "diretor") && (
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              sx={{ py: 2 }}
              component={Link}
              href="/pendingExpenses"
            >
              Ver Despesas Pendentes
            </Button>
          </Grid>
        )}

        {/* Botão visível apenas para o Diretor */}
        {userRole === "diretor" && (
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 2 }}
              component={Link}
              href="/signedExpenses"
            >
              Ver Despesas Assinadas
            </Button>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="text"
          color="error"
          onClick={() => {
            localStorage.removeItem("token");
            Cookies.remove("token");
            window.location.href = "/login";
          }}
        >
          Sair
        </Button>
      </Box>
    </Container>
  );
}
