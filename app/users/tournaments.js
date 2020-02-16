const R = require('ramda')
const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { responseData, responseError } = require('../helpers/response')
const { tournamentSerializer, listTournamentTableSerializer, listTournamentTeamSerializer, availableTeamSerializer, listTournamentSerializer } = require('../response_format/tournament')
const { getTournaments, createTeam, getUserTeam, createTournamentTeam, getUserTournamentTeam, getUserPendingRequest, getTournament, searchTournament } = require('../queries/tournament_query')

exports.tournamentDetail = async (req, res) => {
    const { tournamentId } = req.params
    const tournament = await getTournament(tournamentId)
    responseData(res, tournament)
}

exports.searchTournament = async (req, res) => {
    const { keyword, type } = req.body

    const tournament = await searchTournament(keyword, type)
    responseData(res, tournament)
}

exports.listTournament = async (req, res) => {
    const { categoryId } = req.params
    let tournaments

    if (categoryId == 'all' || categoryId == 'recomended') {
        tournaments = await getTournaments(
            {
                publish: true,
                endDate: { [Op.gt]: new Date() }
            }
        )
    } else {
        tournaments = await getTournaments(
            {
                categoryId: categoryId,
                publish: true,
                endDate: { [Op.gt]: new Date() }
            }
        )
     }
    responseData(res, listTournamentSerializer(tournaments))
}

exports.myTournament = async (req, res) => {
    const tournaments = await getTournaments(
        {
            publish: true,
            endDate: { [Op.gt]: new Date() }
        }
    )
    responseData(res, listTournamentSerializer(tournaments))
}


exports.createTeam = async (req, res) => {
    const { name, categoryId } = req.body
    await createTeam(
        {
            name: name,
            userId: req.uid,
            categoryId: categoryId,
            logo: req.file ? R.replace('public', '', req.file.path) : ''
        }
    )

    const userTeam = await getUserTeam(req.uid)
    const tournamentTeam = await getUserTournamentTeam(req.uid)
    responseData(res, { team: userTeam, tournamentTeam: tournamentTeam })
}

exports.joinTeam = async (req, res) => {
    const { tournamentId, teamId } = req.body
    console.log(tournamentId, teamId)
    await createTournamentTeam(
        [{
            teamId: teamId,
            tournamentId: tournamentId
        }]
    )

    const userTeam = await getUserTeam(req.uid)
    const tournamentTeam = await getUserTournamentTeam(req.uid)

    responseData(res, { team: userTeam, tournamentTeam: tournamentTeam })
}

exports.userTeam = async (req, res) => {
    const userTeam = await getUserTeam(req.uid)
    const tournamentTeam = await getUserTournamentTeam(req.uid)

    responseData(res, { team: userTeam, tournamentTeam: tournamentTeam })
}


exports.pendingRequest = async (req, res) => {
    const pendingRequest = await getUserPendingRequest(req.uid)
    responseData(res, pendingRequest)
}
