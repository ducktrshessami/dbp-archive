'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Attachment.belongsTo(models.Message);
    }
  };
  Attachment.init({
    filename: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    original: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};
