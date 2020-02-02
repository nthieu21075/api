const R = require('ramda')
const asyncMiddleware = require('../middlewares/async_middleware')
const { responseData, responseError } = require('../helpers/response')
const { getOranziers, findOrCreate, getReferees } = require('../queries/user_query')
const { findOrCreatePitch, getPitches } = require('../queries/pitch_query')

exports.organizers = async (req, res) => {
    responseData(res, await getOranziers())
}

exports.referees = async (req, res) => {
    responseData(res, await getReferees())
}

exports.pitches = async (req, res) => {
    responseData(res, await getPitches())
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

exports.creatrReferee = async (req, res) => {
    const { email, price , address, name, location, phoneNumber, password, categoryId } = req.body

    const [user, created] = await findOrCreate(
      { email: email },
      { email: email, price: price , address: address, name: name, location: location, phoneNumber: phoneNumber, password: password, userType: 'referee', categoryId: categoryId }
    )

    if (!created) {
       return responseError(res, 200, 409, 'Email is exsited')
    }

    responseData(res, {}, false)
}

exports.createPitch = async (req, res) => {
    const { name, ownerName, phoneNumber, address, price, location, categoryId } = req.body

    const [pitch, created] = await findOrCreatePitch(
      { name: name, categoryId: categoryId },
      { categoryId: categoryId, name: name, ownerName: ownerName , address: address, phoneNumber: phoneNumber, location: location.split(','), mainImageUrl: req.file ? R.replace('public', '', req.file.path) : '', price: price }
    )

    if (!created) {
       return responseError(res, 200, 409, 'Pitch is exsited')
    }

    responseData(res, {}, false)
}
