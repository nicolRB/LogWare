const express = require("express");
const { db, auth } = require("../firebase"); // Para interagir com o Firebase
const Employee = require("../models/Employee"); // Importa o nosso modelo de funcionário do Mongoose
const verifyToken = require("../middleware/verifyToken"); // Importa o nosso middleware de verificação

const router = express.Router();

/**
 * @route   GET /api/usuario-logado
 * @desc    Verifica o token e retorna os dados do utilizador logado.
 * @access  Privado
 */
router.get("/usuario-logado", verifyToken, async (req, res) => {
  try {
    // Procura o funcionário no MongoDB usando o UID do token verificado
    const employee = await Employee.findOne({ uid: req.user.uid });
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Funcionário não encontrado na base de dados." });
    }
    // Retorna os dados combinados
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      name: employee.name,
      role: employee.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados do funcionário." });
  }
});

/**
 * @route   POST /api/register
 * @desc    Regista um novo utilizador (funcionário).
 * @access  Público (ou protegido por admin)
 */
router.post("/register", async (req, res) => {
  const { name, email, password, role = "colaborador" } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail e senha são obrigatórios." });
  }

  try {
    // 1. Cria o utilizador no Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Define a "role" como uma permissão customizada no token do Firebase
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // 3. Salva os dados do novo funcionário na nossa base de dados MongoDB
    const newEmployee = new Employee({
      uid: userRecord.uid,
      name,
      email,
      role,
    });
    await newEmployee.save();

    res
      .status(201)
      .json({
        message: "Utilizador registado com sucesso.",
        employee: newEmployee,
      });
  } catch (error) {
    console.error("Erro ao registar utilizador:", error);
    // Trata erros comuns do Firebase
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ message: "Este e-mail já está a ser utilizado." });
    }
    res.status(500).json({ message: "Erro interno ao registar o utilizador." });
  }
});

/**
 * A rota de login é apenas um placeholder, pois o login real acontece no frontend
 * com a biblioteca cliente do Firebase, que depois envia o token para o backend.
 */
router.post("/login", (req, res) => {
  res.status(400).json({
    message:
      "Ação não suportada. O login deve ser feito no frontend para obter um token do Firebase.",
  });
});

module.exports = router;
