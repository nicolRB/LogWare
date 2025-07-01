const mongoose = require("mongoose");

// Define o esquema (a estrutura) para os funcionários no MongoDB
const employeeSchema = new mongoose.Schema({
  // O uid é o ID único que vem do Firebase Authentication.
  // Usamos este ID para ligar o registo no MongoDB ao utilizador no Firebase.
  uid: {
    type: String,
    required: true,
    unique: true,
  },

  // Nome do funcionário, que é obrigatório.
  name: {
    type: String,
    required: true,
  },

  // Email do funcionário, que deve ser único.
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // O cargo (role) do funcionário, que só pode ser um dos valores definidos.
  // Por defeito, um novo funcionário é um 'colaborador'.
  role: {
    type: String,
    enum: ["colaborador", "gerente", "diretor"], // Valores permitidos
    default: "colaborador",
    required: true,
  },
});

// Cria e exporta o modelo 'Employee' para que possa ser usado noutras partes do nosso backend.
module.exports = mongoose.model("Employee", employeeSchema);
