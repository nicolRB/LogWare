// src/app/employees/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employees`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao carregar funcionários");
      }
      const data = await res.json();
      setEmployees(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao carregar funcionários."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async () => {
    setError("");
    setMessage("");
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.role ||
      !newEmployee.password
    ) {
      setError("Preencha todos os campos para adicionar um funcionário.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmployee),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Falha ao adicionar funcionário");
      }

      setMessage("Funcionário adicionado com sucesso!");
      setNewEmployee({ name: "", email: "", role: "", password: "" });
      await fetchEmployees(); // Recarrega a lista
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao adicionar funcionário."
      );
    }
  };

  const handleUpdateEmployee = async () => {
    setError("");
    setMessage("");
    if (!editEmployee) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${editEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editEmployee.name,
            role: editEmployee.role,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Falha ao atualizar funcionário");
      }

      setMessage("Funcionário atualizado com sucesso!");
      setEditEmployee(null);
      await fetchEmployees();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao atualizar funcionário."
      );
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    setError("");
    setMessage("");
    if (!confirm("Tem certeza que deseja deletar este funcionário?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha ao deletar funcionário");
      }

      setMessage("Funcionário deletado com sucesso.");
      await fetchEmployees();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao deletar funcionário."
      );
    }
  };

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
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        mb={4}
      >
        Gerenciamento de Funcionários
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          editEmployee ? handleUpdateEmployee() : handleAddEmployee();
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
          p: 3,
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6">
          {editEmployee ? "Editar Funcionário" : "Adicionar Novo Funcionário"}
        </Typography>
        <TextField
          label="Nome"
          fullWidth
          value={editEmployee ? editEmployee.name : newEmployee.name}
          onChange={(e) =>
            editEmployee
              ? setEditEmployee({ ...editEmployee, name: e.target.value })
              : setNewEmployee({ ...newEmployee, name: e.target.value })
          }
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={editEmployee ? editEmployee.email : newEmployee.email}
          onChange={(e) =>
            editEmployee
              ? setEditEmployee({ ...editEmployee, email: e.target.value })
              : setNewEmployee({ ...newEmployee, email: e.target.value })
          }
        />
        <TextField
          label="Cargo (colaborador, gerente, diretor)"
          fullWidth
          value={editEmployee ? editEmployee.role : newEmployee.role}
          onChange={(e) =>
            editEmployee
              ? setEditEmployee({ ...editEmployee, role: e.target.value })
              : setNewEmployee({ ...newEmployee, role: e.target.value })
          }
        />
        {!editEmployee && (
          <TextField
            label="Senha"
            type="password"
            fullWidth
            value={newEmployee.password}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, password: e.target.value })
            }
          />
        )}
        <Button type="submit" variant="contained" color="primary">
          {editEmployee ? "Salvar Edição" : "Adicionar Funcionário"}
        </Button>
        {editEmployee && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditEmployee(null)}
          >
            Cancelar Edição
          </Button>
        )}
      </Box>

      <Typography variant="h5" gutterBottom mt={4}>
        Lista de Funcionários
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {employees.map((employee) => (
            <ListItem key={employee._id} divider>
              <ListItemText
                primary={employee.name}
                secondary={`Email: ${employee.email} | Cargo: ${employee.role}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => setEditEmployee(employee)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteEmployee(employee._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

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
