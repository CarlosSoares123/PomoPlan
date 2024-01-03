'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventoEstudo extends Model {
    static associate(models) {
      EventoEstudo.belongsTo(models.User, {foreignKey: "userId"})
    }
  }
  EventoEstudo.init(
    {
      userId: DataTypes.STRING,
      titulo: DataTypes.STRING,
      categoria: DataTypes.STRING,
      inicio: DataTypes.DATE,
      fim: DataTypes.DATE,
      duracao: DataTypes.INTEGER,
      status: DataTypes.STRING,
      dia: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'EventoEstudo'
    }
  )
  return EventoEstudo;
};