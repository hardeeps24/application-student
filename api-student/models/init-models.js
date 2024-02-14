var DataTypes = require("sequelize").DataTypes;
var _form = require("./form");
var _student = require("./student");

function initModels(sequelize) {
  var form = _form(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);


  return {
    form,
    student,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
