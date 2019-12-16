const R = require('ramda')
const _ = require('lodash')
const { responseData, responseError } = require('../helpers/response')
const { getPendingRequest } = require('../queries/tournament_query')

const alphabet = R.split('', 'abcdefghijklmnopqrstuvwxyz')

exports.pendingRequest = async (req, res) => {
    const pendingRequest  = await getPendingRequest()

    responseData(res, pendingRequest)
}

