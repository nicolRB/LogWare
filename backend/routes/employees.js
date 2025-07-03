// backend/routes/employees.js

const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const verifyToken = require("../middleware/verifyToken");

// Todas as rotas de funcionários exigem autenticação
router.use(verifyToken);

// Rota para LISTAR todos os funcionários
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar funcionários.", error });
  }
});

// Rota para ATUALIZAR um funcionário
router.put("/employees/:id", async (req, res) => {
  const { name, role } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, role },
      { new: true } // Retorna o documento atualizado
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar funcionário.", error });
  }
});

// Rota para DELETAR um funcionário
router.delete("/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }
    res.json({ message: "Funcionário deletado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar funcionário.", error });
  }
});

module.exports = router;
