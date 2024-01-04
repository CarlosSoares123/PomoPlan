'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MetaEstudo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MetaEstudo.belongsTo(models.EventoEstudo, { foreignKey: 'eventoId' })
    }
  }
  MetaEstudo.init(
    {
      eventoId: DataTypes.INTEGER,
      descricao: DataTypes.STRING,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'MetaEstudo'
    }
  )
  return MetaEstudo
}
