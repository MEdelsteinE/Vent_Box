const { Model, DataTypes } = require('sequelize');
const db = require('../config/connection');

const dayjs = require('dayjs');

class Vent extends Model { }

Vent.init({
  text: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: 3,
        msg: 'Your Vent message must be at least 3 characters in length.'
      }
    }
  },
  date: {
    type: DataTypes.VIRTUAL,
    get() {
      return dayjs(this.createdAt).format('MM/DD/YYYY hh:mma')
    }
  }
}, {
  modelName: 'user_vents',
  freezeTableName: true,
  sequelize: db
});

module.exports = Vent;