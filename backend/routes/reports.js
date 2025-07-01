const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const verifyToken = require("../middleware/verifyToken");

// Middleware para todas as rotas de relatórios
router.use(verifyToken);

// Criar um novo relatório
router.post("/reports", async (req, res) => {
  const { descricao, valor } = req.body;
  const colaboradorId = req.user.uid; // UID do usuário logado (do token)

  if (!descricao || !valor) {
    return res
      .status(400)
      .json({ message: "Descrição e valor são obrigatórios." });
  }

  try {
    const newReport = new Report({
      descricao,
      valor,
      colaboradorId,
      status: "pendente",
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar relatório.", error });
  }
});

// Listar relatórios pendentes (para gerentes)
router.get("/reports/pending", async (req, res) => {
  // Adicionar verificação de role (ex: if (req.user.role !== 'gerente'))
  try {
    const pendingReports = await Report.find({ status: "pendente" });
    res.json(pendingReports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar relatórios pendentes.", error });
  }
});

// Listar relatórios assinados (para diretores)
router.get("/reports/signed", async (req, res) => {
  // Adicionar verificação de role (ex: if (req.user.role !== 'diretor'))
  try {
    const signedReports = await Report.find({ status: "assinado" });
    res.json(signedReports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar relatórios assinados.", error });
  }
});

// Obter um relatório específico por ID
router.get("/reports/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado." });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar relatório.", error });
  }
});

// Aprovar um relatório (Gerente)
router.put("/reports/:id/approve", async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "aprovado", approvedAt: new Date() },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado." });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao aprovar relatório.", error });
  }
});

// Rejeitar um relatório (Gerente)
router.put("/reports/:id/reject", async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "rejeitado" },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado." });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao rejeitar relatório.", error });
  }
});

// Assinar um relatório (Diretor)
router.post("/reports/:id/sign", async (req, res) => {
  const { signature, publicKey, signedHash } = req.body;

  if (!signature || !publicKey || !signedHash) {
    return res
      .status(400)
      .json({ message: "Dados da assinatura incompletos." });
  }

  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: "assinado",
        signature,
        publicKey,
        signedHash,
        signedAt: new Date(),
      },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado." });
    }
    res.json({ message: "Relatório assinado com sucesso!", report });
  } catch (error) {
    res.status(500).json({ message: "Erro ao assinar relatório.", error });
  }
});

module.exports = router;
