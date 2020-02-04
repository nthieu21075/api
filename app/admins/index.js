const R = require('ramda')
const bcrypt = require('bcrypt')
const asyncMiddleware = require('../middlewares/async_middleware')
const { responseData, responseError } = require('../helpers/response')
const { getOranziers, findOrCreate, getReferees, getOrganzier, updateOrganzier, getReferee, updateReferee } = require('../queries/user_query')
const { findOrCreatePitch, getPitches, getPitch, updatePitch } = require('../queries/pitch_query')
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

exports.organizerDetail = async (req, res) => {
    const { id } = req.params
    responseData(res, await getOrganzier(id))
}

exports.refereeDetail = async (req, res) => {
    const { id } = req.params
    responseData(res, await getReferee(id))
}

exports.pitchDetail = async (req, res) => {
    const { id } = req.params
    responseData(res, await getPitch(id))
}

exports.updatePitch = async (req, res) => {
    const { name, ownerName, phoneNumber, address, price, location, categoryId, id, removeImage } = req.body

    let fields = {
      id: id,
      categoryId: categoryId,
      name: name,
      ownerName: ownerName,
      address: address,
      phoneNumber: phoneNumber,
      location: location.split(','),
      price: price
    }

    if (req.file) {
      fields['mainImageUrl'] = R.replace('public', '', req.file.path)
    }

    if (removeImage) {
      fields['mainImageUrl'] = ''
    }

    const [result, pitch] = await updatePitch(id, fields)

    if (result == 0) {
        responseError(res, 200, 404, 'Pitch did not exist')
    } else {
        responseData(res, pitch)
    }
}

exports.updateReferee = async (req, res) => {
    const { email, price , address, name, location, phoneNumber, password, categoryId, id } = req.body

    let fields = { email: email, price: price , address: address, name: name, location: location, phoneNumber: phoneNumber, categoryId: categoryId }

    if (password) {
      await bcrypt.hash(R.toString(password), 10)
          .then(hash => {
              fields['password'] = hash
          }).catch(err => {
              console.log(err)
              throw new Error()
          })
    }

    const [result, user] = await updateReferee(id, fields)

    if (result == 0) {
        responseError(res, 200, 404, 'User did not exist')
    } else {
        responseData(res, user)
    }
}

exports.updateOrganizer = async (req, res) => {
    const { email, organizerName , address, name, location, phoneNumber, password, id } = req.body

    let fields = { email: email, organizerName: organizerName , address: address, name: name, location: location, phoneNumber: phoneNumber }

    if (password) {
      await bcrypt.hash(R.toString(password), 10)
          .then(hash => {
              fields['password'] = hash
          }).catch(err => {
              console.log(err)
              throw new Error()
          })
    }

    const [result, user] = await updateOrganzier(id, fields)

    if (result == 0) {
        responseError(res, 200, 404, 'User did not exist')
    } else {
        responseData(res, user)
    }
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
