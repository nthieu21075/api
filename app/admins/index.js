const R = require('ramda')
const asyncMiddleware = require('../middlewares/async_middleware')
const { responseData, responseError } = require('../helpers/response')
const { getOranziers, findOrCreate, getReferees } = require('../queries/user_query')

exports.organizers = async (req, res) => {
    responseData(res, await getOranziers())
}

exports.referees = async (req, res) => {
    responseData(res, await getReferees())
}

exports.creatrOrganizer = async (req, res) => {
    const { email, organizerName , address, name, location, phoneNumber, password } = req.body
    const [user, created] = await findOrCreate(
      { email: email },
      { email: email, organizerName: organizerName , address: address, name: name, location: location, phoneNumber: phoneNumber, password: password, userType: 'organizer' }
    )

    if (!created) {
       return responseError(res, 200, 409, 'Email is exsited')
    }

    responseData(res, {}, false)
}

