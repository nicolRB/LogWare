// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("-> [server.js] Ficheiro do servidor carregado.");

// --- Importação das Rotas ---
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const employeeRoutes = require("./routes/employees");
console.log("-> [server.js] Ficheiros de rotas importados.");

// --- Registo das Rotas na Aplicação ---
app.use("/api", authRoutes);
console.log("-> [server.js] Rota de autenticação registada.");
app.use("/api", reportRoutes);
console.log("-> [server.js] Rota de relatórios registada.");
app.use("/api", employeeRoutes);
console.log("-> [server.js] Rota de funcionários registada.");

// --- Conexão com o Banco de Dados e Inicialização do Servidor ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("--> MongoDB conectado com sucesso!");
    app.listen(5000, () =>
      console.log("--> Servidor backend a escutar na porta 5000")
    );
  })
  .catch((err) => console.error("!!! ERRO ao conectar ao MongoDB:", err));
