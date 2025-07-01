const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  valor: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pendente", "aprovado", "rejeitado", "assinado"],
    default: "pendente",
  },
  colaboradorId: { type: String, required: true }, // UID do Firebase do colaborador
  // Campos para a Assinatura Digital
  signature: { type: String },
  publicKey: { type: mongoose.Schema.Types.Mixed }, // Usamos Mixed para armazenar o objeto JWK
  signedHash: { type: String },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  signedAt: { type: Date },
});

module.exports = mongoose.model("Report", reportSchema);
