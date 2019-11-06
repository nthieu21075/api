const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const R = require('ramda')
const asyncMiddleware = require('../middlewares/async_middleware')
const { responseData, responseError } = require('../helpers/response')
const { findUserById, updateUser } = require('../queries/user_query')
const { userSerialize } = require('../response_format/user')

exports.updateProfile = async (req, res) => {
    const { email, organizerName , address, name, location, phoneNumber } = req.body
    const [result, user] = await updateUser(req.uid,
        { email: email, organizerName: organizerName , address: address, name: name, location: location, phoneNumber: phoneNumber }
    )

    if (result == 0) {
        responseError(res, 200, 404, 'User did not exist')
    } else {
        responseData(res, { user: userSerialize(user[0].dataValues) })
    }
}

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const user = await findUserById(req.uid)

    if (!user) {
        responseError(res, 200, 404, 'User did not exist')
    } else {
        user.isCorrectPassword(R.toString(currentPassword), (err, same) => {
            if (err) {
                responseError(res, 500, 500, err)
            } else if (!same) {
                responseError(res, 200, 409, 'Incorrect password')
            } else {
                updatePassword(res, req.uid, newPassword)
            }
        })
    }
}

const updatePassword = async (res, uid, newPassword) => {
    let encryptPassword = newPassword

    await bcrypt.hash(R.toString(newPassword), 10)
        .then(hash => {
            console.log(hash)
            encryptPassword = hash
        }).catch(err => {
            console.log(err)
            throw new Error()
        })

    const [result, updatedUser] = await updateUser(uid, { password: encryptPassword })

    if (result == 0) {
        responseError(res, 200, 409, 'Update password was failed')
    } else {
        responseData(res, { user: userSerialize(updatedUser[0].dataValues) })
    }
}