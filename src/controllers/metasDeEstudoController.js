const { MetaEstudo, EventoEstudo } = require('../../database/models')

const Joi = require('joi')

const MetaDeEstudo = {
  getMetas: async (req, res) => {
    try {
      const eventoId = req.params.eventoId

      const metas = await MetaEstudo.findAll({ where: { eventoId } })
      return res.status(200).json(metas)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do Servidor.' })
    }
  },
  criarMeta: async (req, res) => {
    try {
      const eventoId = req.params.eventoId
      const { descricoes } = req.body

      const evento = await EventoEstudo.findByPk(eventoId)
      if (!evento) {
        return res
          .status(409)
          .json({ error: 'Por favor insira Id de um evento existente' })
      }

      const schema = Joi.object({
        descricoes: Joi.array().items(Joi.string().required()).required()
      })
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(409).json({ error: error.details[0].message })
      }

      const novasMetas = await MetaEstudo.bulkCreate(
        descricoes.map(descricao => ({
          descricao,
          status: 'Incompleta',
          eventoId
        }))
      )

      return res.status(200).json(novasMetas)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do Servidor.' })
    }
  },
  actualizarMeta: async (req, res) => {
    try {
      const metaId = req.params.metaId

      const meta = await MetaEstudo.findByPk(metaId)
      if (!meta) {
        return res.status(409).json({ error: 'Meta não encontrada' })
      }

      const schema = Joi.object({
        descricao: Joi.string().required()
      })
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(409).json({ error: error.details[0].message })
      }

      await meta.upload(req.body)
      res.status(200).json(meta)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do Servidor.' })
    }
  },
  excluirMeta: async (req, res) => {
    try {
      const metaId = req.params.metaId

      const meta = await MetaEstudo.findByPk(metaId)
      if (!meta) {
        return res.status(409).json({ error: 'Meta não encontrada' })
      }

      await meta.destroy()
      return res.status(200).json({ message: 'Meta eliminada com sucesso' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno do Servidor.' })
    }
  }
}

module.exports = MetaDeEstudo
