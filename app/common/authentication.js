const jwt = require('jsonwebtoken')
const R = require('ramda')
const { responseData, responseError } = require('../helpers/response')
const { findUserByEmail, findOrCreate } = require('../queries/user_query')
const { userSerialize } = require('../response_format/user')

exports.login = async (req, res) => {
    const { email, password } = req.body
    const user  = await findUserByEmail(email)

    if (!user) {
        responseError(res, 200, 409, 'User did not exist')
    } else {
        user.isCorrectPassword(R.toString(password), (err, same) => {
            if (user.get({plain: true}).userType != 'normal') {
               return responseError(res, 200, 409, 'User did not exist')
            }

            if (err) {
                responseError(res, 200, 500, err)
            } else if (!same) {
                responseError(res, 200, 409, 'Incorrect password')
            } else {
                const token = jwt.sign({ uid: user.id }, process.env.JSON_WEB_TOKEN_SECRECT, { expiresIn: '5h' })

                responseData(res, { user: userSerialize(user.get({plain: true})) }, true, token)
            }
        })
    }
}

exports.organizerLogin = async (req, res) => {
    const { email, password } = req.body
    const user  = await findUserByEmail(email)

    if (!user) {
        responseError(res, 200, 409, 'User did not exist')
    } else {
        if (user.get({plain: true}).userType != 'organizer') {
           return responseError(res, 200, 409, 'User did not exist')
        }

        user.isCorrectPassword(R.toString(password), (err, same) => {
            if (err) {
                responseError(res, 200, 500, err)
            } else if (!same) {
                responseError(res, 200, 409, 'Incorrect password')
            } else {
                const token = jwt.sign({ uid: user.id }, process.env.JSON_WEB_TOKEN_SECRECT, { expiresIn: '5h' })

                responseData(res, { user: userSerialize(user.get({plain: true})) }, true, token)
            }
        })
    }
}

exports.register = async (req, res) => {
    const { email, password, name } = req.body
    const [user, created] = await findOrCreate({ email: email }, { password: password, name: name })

    if (!created) {
       return responseError(res, 200, 409, 'Email is exsited')
    }
    const token = jwt.sign({ uid: user.id }, process.env.JSON_WEB_TOKEN_SECRECT, { expiresIn: '5h' })

    responseData(res, { user: userSerialize(user.get({plain: true})) }, true, token)
}