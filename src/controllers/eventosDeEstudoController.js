const { EventoEstudo } = require('../../database/models')
const { Op } = require('sequelize')

const Joi = require('joi')

const EventoDeEstudo = {
  getEventosEstudo: async (req, res) => {
    try {
      const userId = req.user.userId
      const eventos = await EventoEstudo.findAll({ where: { userId } })
      return res.status(200).json(eventos)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },
  getEventosCompletos: async (req, res) => {
    try {
      const userId = req.user.userId
      const eventosCompletos = await EventoEstudo.findAll({
        where: {
          userId,
          status: 'completo'
        }
      })

      res.status(200).json(eventosCompletos)
    } catch (error) {
      console.log(error)
      return res.status().json({ erro: 'Erro interno so Servidor' })
    }
  },
  criarEvento: async (req, res) => {
    try {
      const userId = req.user.userId
      const { titulo, categoria, inicio, fim, dia } = req.body

      const schema = Joi.object({
        titulo: Joi.string().required(),
        categoria: Joi.string().required(),
        inicio: Joi.string()
          .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        fim: Joi.string()
          .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        dia: Joi.string().required(),
        status: Joi.string().required()
      })

      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(409).json({ error: error.details[0].message })
      }

      const evento = await EventoEstudo.findOne({where: {titulo} })
      if(evento) {
        return res.status(409).json({message: "Este Evento já existe."})
      }

      let hoje = new Date()

      if (dia === 'amanha') {
        hoje.setDate(hoje.getDate() + 1)
      }

      const inicioDate = new Date(hoje.setHours(...inicio.split(':'), 0, 0))
      const fimDate = new Date(hoje.setHours(...fim.split(':'), 0, 0))

      const duracaoEmMinutos = (fimDate - inicioDate) / (1000 * 60)

      const conflitosEventos = await EventoEstudo.findAll({
        where: {
          userId,
          inicio: { [Op.between]: [inicioDate, fimDate] }
        }
      })

      if (conflitosEventos.length > 0) {
        return res
          .status(200)
          .json({ disponibilidade: false, conflitosEventos })
      }

      const novoEvento = await EventoEstudo.create({
        userId,
        titulo,
        categoria,
        inicio: inicioDate,
        fim: fimDate,
        duracao: duracaoEmMinutos,
        status: 'Incompleto'
      })

      return res
        .status(200)
        .json({ message: `Evento criado com sucesso para ${dia}`, novoEvento })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro interno do Servidor' })
    }
  },

  actualizarEvento: async (req, res) => {
    try {
      const eventoId = req.params.eventoId

      const evento = await EventoEstudo.findByPk(eventoId)
      if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado.' })
      }

      const schema = Joi.object({
        titulo: Joi.string(),
        categoria: Joi.string(),
        inicio: Joi.date(),
        fim: Joi.date(),
        duracao: Joi.date(),
        status: Joi.string()
      })
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(409).json({ error: error.details[0].message })
      }

      await evento.update(req.body)
      res.status(200).json(evento)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do Servidor.' })
    }
  },
  excluirEvento: async (req, res) => {
    try {
      const eventoId = req.params.eventoId
      const evento = await EventoEstudo.findByPk(eventoId)
      if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado.' })
      }
      await evento.destroy()
      return res.status(200).json({ message: 'Evento eliminado com sucesso' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Erro interno do Servidor' })
    }
  }
}


module.exports = EventoDeEstudo
