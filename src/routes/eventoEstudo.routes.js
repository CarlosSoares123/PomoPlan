const express = require('express')
const router = express()
const verifyToken = require('../middlewares/authMiddleware')
const eventoControllers = require('../controllers/eventosDeEstudoController')

router.get('/', verifyToken ,eventoControllers.getEventosEstudo)
router.get('/completos', verifyToken,eventoControllers.getEventosCompletos)
router.post('/criar', verifyToken, eventoControllers.criarEvento)
router.put('/actualizar', verifyToken, eventoControllers.actualizarEvento)
router.delete('/excluir', verifyToken, eventoControllers.excluirEvento)

module.exports = router
