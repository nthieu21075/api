const jwt = require('jsonwebtoken')
const { responseError } = require('../helpers/response.js')

const withAuth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token

    if (!token) {
        responseError(res, 401, 401, 'Unauthorized: No token provided!')
    } else {
        jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRECT, (err, decoded) => {
            if (err) {
                responseError(res, 401, 401, 'Unauthorized: Invalid token!')
            } else {
                req.uid = decoded.uid
                next()
            }
        })
    }
}

module.exports = withAuth