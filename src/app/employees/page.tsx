// src/app/employees/page.tsx
"use client"; // Esta página provavelmente precisará de Client Components para o CRUD

import {useState, useEffect} from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Assumindo uma interface básica para funcionário
interface Employee {
  _id: string; // ou 'id' dependendo do seu backend
  name: string;
  email: string;
  role: string; // Ex: "colaborador", "gerente", "diretor"
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({name: "", email: "", role: ""});
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função para carregar funcionários (simulada por enquanto)
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError("");
      try {
        // Implementar fetch para sua API de backend para listar funcionários
        // Ex: const token = localStorage.getItem('token');
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // if (!res.ok) throw new Error('Falha ao carregar funcionários');
        // const data = await res.json();
        // setEmployees(data); // Assumindo que a API retorna um array de funcionários

        // Simulação de dados para o build passar
        setEmployees([
          {_id: "1", name: "João Silva", email: "joao@empresa.com", role: "colaborador"},
          {_id: "2", name: "Maria Souza", email: "maria@empresa.com", role: "gerente"},
        ]);
      } catch (err: unknown) {
        console.error("Erro ao carregar funcionários:", err);
        setError(`Erro ao carregar funcionários: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Funções para CRUD (esqueletos)
  const handleAddEmployee = async () => {
    setError("");
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) {
      setError("Preencha todos os campos para adicionar um funcionário.");
      return;
    }
    try {
      // Implementar fetch para sua API de backend para adicionar funcionário
      console.log("Adicionar funcionário:", newEmployee);
      // const token = localStorage.getItem('token');
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      //   body: JSON.stringify(newEmployee)
      // });
      // if (!res.ok) throw new Error('Falha ao adicionar funcionário');
      // const addedEmployee = await res.json();
      // setEmployees([...employees, addedEmployee]); // Adiciona o novo funcionário ao estado
      setEmployees([...employees, {_id: String(Date.now()), ...newEmployee}]); // Simulação
      setNewEmployee({name: "", email: "", role: ""});
    } catch (err: unknown) {
      console.error("Erro ao adicionar funcionário:", err);
      setError(`Erro ao adicionar funcionário: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUpdateEmployee = async () => {
    setError("");
    if (!editEmployee || !editEmployee.name || !editEmployee.email || !editEmployee.role) {
      setError("Preencha todos os campos para editar um funcionário.");
      return;
    }
    try {
      // Implementar fetch para sua API de backend para atualizar funcionário
      console.log("Atualizar funcionário:", editEmployee);
      // const token = localStorage.getItem('token');
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${editEmployee._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      //   body: JSON.stringify(editEmployee)
      // });
      // if (!res.ok) throw new Error('Falha ao atualizar funcionário');
      // setEmployees(employees.map(emp => emp._id === editEmployee._id ? editEmployee : emp)); // Atualiza no estado
      setEmployees(employees.map((emp) => (emp._id === editEmployee._id ? editEmployee : emp))); // Simulação
      setEditEmployee(null); // Fecha o formulário de edição
    } catch (err: unknown) {
      console.error("Erro ao atualizar funcionário:", err);
      setError(`Erro ao atualizar funcionário: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    setError("");
    try {
      // Implementar fetch para sua API de backend para deletar funcionário
      console.log("Deletar funcionário com ID:", id);
      // const token = localStorage.getItem('token');
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // if (!res.ok) throw new Error('Falha ao deletar funcionário');
      // setEmployees(employees.filter(emp => emp._id !== id)); // Remove do estado
      setEmployees(employees.filter((emp) => emp._id !== id)); // Simulação
    } catch (err: unknown) {
      console.error("Erro ao deletar funcionário:", err);
      setError(`Erro ao deletar funcionário: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (loading) return <Typography>Carregando funcionários...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{mt: 8, p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3}}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
        Gerenciamento de Funcionários
      </Typography>

      {/* Formulário de Adição/Edição */}
      <Box
        component="form"
        sx={{display: "flex", flexDirection: "column", gap: 2, mb: 4, p: 3, border: "1px solid #eee", borderRadius: "8px"}}
      >
        <Typography variant="h6">{editEmployee ? "Editar Funcionário" : "Adicionar Novo Funcionário"}</Typography>
        <TextField
          label="Nome"
          fullWidth
          value={editEmployee ? editEmployee.name : newEmployee.name}
          onChange={(e) =>
            editEmployee ? setEditEmployee({...editEmployee, name: e.target.value}) : setNewEmployee({...newEmployee, name: e.target.value})
          }
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={editEmployee ? editEmployee.email : newEmployee.email}
          onChange={(e) =>
            editEmployee
              ? setEditEmployee({...editEmployee, email: e.target.value})
              : setNewEmployee({...newEmployee, email: e.target.value})
          }
        />
        <TextField
          label="Cargo"
          fullWidth
          value={editEmployee ? editEmployee.role : newEmployee.role}
          onChange={(e) =>
            editEmployee ? setEditEmployee({...editEmployee, role: e.target.value}) : setNewEmployee({...newEmployee, role: e.target.value})
          }
        />
        <Button variant="contained" color="primary" onClick={editEmployee ? handleUpdateEmployee : handleAddEmployee}>
          {editEmployee ? "Salvar Edição" : "Adicionar Funcionário"}
        </Button>
        {editEmployee && (
          <Button variant="outlined" color="secondary" onClick={() => setEditEmployee(null)}>
            Cancelar Edição
          </Button>
        )}
      </Box>

      {/* Lista de Funcionários */}
      <Typography variant="h5" gutterBottom mt={4}>
        Lista de Funcionários
      </Typography>
      <List sx={{width: "100%", bgcolor: "background.paper"}}>
        {employees.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            Nenhum funcionário cadastrado.
          </Typography>
        ) : (
          employees.map((employee) => (
            <ListItem key={employee._id} divider sx={{"&:hover": {bgcolor: "action.hover"}}}>
              <ListItemText primary={employee.name} secondary={`Email: ${employee.email} | Cargo: ${employee.role}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => setEditEmployee(employee)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEmployee(employee._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
}
