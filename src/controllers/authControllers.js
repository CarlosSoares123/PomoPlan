const { User } = require('../../database/models')
require('dotenv').config()

const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const secretJwt = process.env.SECRET_JWT

const AuthController = {
  register: async (req, res) => {
    try {
      const { fullName, email, password, confirmedPassword } = req.body

      const userExist = await User.findOne({ where: { email } })
      if (userExist) {
        return res
          .status(409)
          .json({ message: 'Esse email já possui uma conta ' })
      }

      const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(12)
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
          )
          .required(),
        confirmedPassword: Joi.string()
          .min(12)
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
          )
          .required()
      })
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(409).json({ error: error.details[0].message })
      }

      if (password != confirmedPassword) {
        return res.status(400).json({ error: 'As senhas devem ser iguais.' })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        id: uuidv4(),
        fullName,
        email,
        passwordHash
      })

      return res
        .status(201)
        .json({ message: 'Usuário criando com sucesso', newUser })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Por favor preencha todos os campos' })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ error: 'Credênciais invalidas' })
      }

      const passwordMath = await bcrypt.compare(password, user.passwordHash)
      if (!passwordMath) {
        return res.status(404).json({ error: 'Credênciais invalidas' })
      }

      const token = jwt.sign({ userId: user.id }, secretJwt)
      res.setHeader('Authorization', `Bearer ${token}`)

      return res.status(200).json({ message: 'Login realizado com sucesso!', token })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}

module.exports = AuthController