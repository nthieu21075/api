const jwt = require('jsonwebtoken')
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
        responseError(res, 200, 401, 'User did not exist')
    } else {
        responseData(res, { user: userSerialize(user[0].dataValues) })
    }
}
