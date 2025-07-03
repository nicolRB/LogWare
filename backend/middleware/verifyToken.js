// backend/middleware/verifyToken.js
const { auth } = require("../firebase");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    // Se não houver token, retorna o erro 401
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    // Verifica a validade do token com o Firebase
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Adiciona os dados do utilizador à requisição
    next(); // Passa para a próxima etapa (a rota em si)
  } catch (error) {
    console.error("Erro detalhado ao verificar token Firebase:", error);
    return res
      .status(401)
      .json({ message: "Token inválido ou expirado.", error: error.message });
  }
}

module.exports = verifyToken;
