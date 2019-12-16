const R = require('ramda')
const _ = require('lodash')
const { responseData, responseError } = require('../helpers/response')
const { getPendingRequest, updateTournamentTeam } = require('../queries/tournament_query')

exports.pendingRequest = async (req, res) => {
    const pendingRequest  = await getPendingRequest()

    responseData(res, pendingRequest)
}

exports.approvePendingRequest = async (req, res) => {
    const { tournamentId } = req.body

    await updateTournamentTeam(tournamentId, { status: 'approved' })

    const pendingRequest  = await getPendingRequest()

    responseData(res, pendingRequest)
}

exports.unapprovePendingRequest = async (req, res) => {
    const { tournamentId } = req.body

    await updateTournamentTeam(tournamentId, { status: 'canceled' })

    const pendingRequest  = await getPendingRequest()

    responseData(res, pendingRequest)
}