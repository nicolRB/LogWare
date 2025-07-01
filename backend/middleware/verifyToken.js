const { auth } = require('../firebase');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token ausente.' });
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro ao verificar token Firebase:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = verifyToken;