const express = require('express')
const router = express()
const verifyToken = require('../middlewares/authMiddleware')
const metaDeEstudo = require('../controllers/metasDeEstudoController')

router.get('/:eventoId', verifyToken, metaDeEstudo.getMetas)
router.post('/:eventoId/criar', verifyToken, metaDeEstudo.criarMeta)
router.put('/actualizar', verifyToken, metaDeEstudo.actualizarMeta)
router.delete('/excluir', verifyToken, metaDeEstudo.excluirMeta)

module.exports = router
