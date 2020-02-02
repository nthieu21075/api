const R = require('ramda')
const asyncMiddleware = require('../middlewares/async_middleware')
const { responseData, responseError } = require('../helpers/response')
const { getOranziers, findOrCreate, getReferees } = require('../queries/user_query')
const { findOrCreatePitch, getPitches } = require('../queries/pitch_query')
const { getAll, findOrCreate: findOrCreateCategory } = require('../queries/category_query')
const { createManual, getManual, destroyManual } = require('../queries/manual_query')

exports.organizers = async (req, res) => {
    responseData(res, await getOranziers())
}

exports.referees = async (req, res) => {
    responseData(res, await getReferees())
}

exports.pitches = async (req, res) => {
    responseData(res, await getPitches())
}

exports.categories = async (req, res) => {
    responseData(res, await getAll())
}

exports.getManual = async (req, res) => {
    responseData(res, await getManual())
}

exports.removeManual = async (req, res) => {
    const { id } = req.params
    await destroyManual(id)
    responseData(res, await getManual())
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

exports.createCategory = async (req, res) => {
    const { name } = req.body

    const [category, created] = await findOrCreateCategory(
      { name: name },
      { name: name, imageUrl: req.file ? R.replace('public', '', req.file.path) : '' }
    )

    if (!created) {
       return responseError(res, 200, 409, 'Category is exsited')
    }

    responseData(res, {}, false)
}

exports.createManual = async (req, res) => {
    const manualData = R.map((item) => ({
      originalName: item.originalname,
      path: R.replace('public', '', item.path)
    }), req.files)

    await createManual(manualData)
    responseData(res, {}, false)
}
