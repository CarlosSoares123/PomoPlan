const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretJwt = process.env.SECRET_JWT

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ error: 'Token nao fornecido' })
  }

  const tokenParts = token.split(' ')
  if(tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format.' })
  }

  const cleanToken = tokenParts[1]
  jwt.verify(cleanToken, secretJwt, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication Error.' })
    }

    req.user =decoded
    next()
  })
}

module.exports = verifyToken