// backend/routes/auth.js
const express = require("express");
const { auth } = require("../firebase");
const Employee = require("../models/Employee");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/usuario-logado", verifyToken, async (req, res) => {
  console.log("-> [auth.js] A rota /api/usuario-logado foi acionada."); // LOG ADICIONADO AQUI
  try {
    const employee = await Employee.findOne({ uid: req.user.uid });
    if (!employee) {
      console.error(
        `!!! [auth.js] Funcionário não encontrado no MongoDB para o UID: ${req.user.uid}`
      );
      return res
        .status(404)
        .json({ message: "Funcionário não encontrado na base de dados." });
    }
    console.log(
      `--> [auth.js] Dados do funcionário ${employee.name} encontrados.`
    );
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      name: employee.name,
      role: employee.role,
    });
  } catch (error) {
    console.error("!!! [auth.js] Erro ao buscar dados do funcionário:", error);
    res
      .status(500)
      .json({ message: "Erro de servidor ao buscar dados do funcionário." });
  }
});

router.post("/register", async (req, res) => {
  // ... (o resto do ficheiro continua igual)
  const { name, email, password, role = "colaborador" } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail e senha são obrigatórios." });
  }
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    await auth.setCustomUserClaims(userRecord.uid, { role });
    const newEmployee = new Employee({
      uid: userRecord.uid,
      name,
      email,
      role,
    });
    await newEmployee.save();
    res.status(201).json({
      message: "Utilizador registado com sucesso.",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Erro ao registar utilizador:", error);
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ message: "Este e-mail já está a ser utilizado." });
    }
    res.status(500).json({ message: "Erro interno ao registar o utilizador." });
  }
});

module.exports = router;
