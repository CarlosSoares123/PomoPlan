const app = require('./app')
require('../database/models')

const Port = 3000


const server = app.listen(Port, () => {
  console.log(`Servidor rodando na porta ${Port}`)
})


module.exports = server