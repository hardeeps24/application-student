const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('form', {
    roll_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "not null"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "not null"
    },
    standard: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "not null"
    }
  }, {
    sequelize,
    tableName: 'form',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roll_no" },
        ]
      },
    ]
  });
};
