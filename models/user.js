const R = require('ramda')
const bcrypt = require('bcrypt')
const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const User = sequelizeDb.define('users', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail : true
        }
    },
    location: {
        type: sequelize.STRING
    },
    userType: {
        type: sequelize.ENUM,
        values: ['normal', 'referee', 'organizer', 'admin']
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: sequelize.DATE
    },
    updatedAt: {
        type: sequelize.DATE
    }
}, {
    freezeTableName: true
})

User.prototype.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, same) => {
        err ? callback(err) : callback(err, same)
    })
}

User.beforeCreate((user, options) => {
    return bcrypt.hash(R.toString(user.password), 10)
        .then(hash => {
            user.password = hash
        }).catch(err => {
            console.log(err)
            throw new Error()
        })
})

module.exports = User