const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', 'T1n1nh@1313', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize
