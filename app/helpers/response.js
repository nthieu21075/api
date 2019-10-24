const errors = {

}

const errorParams = code => ({ code: code, message: errors[code] })

exports.responseError = (res, httpCode, resCode, message) => {
  if (errors[resCode]) {
    res.status(httpCode).send({ code: resCode, message: errors[resCode] })
  } else {
    res.status(httpCode).send({ code: resCode, message: message })
  }
}

exports.responseData = (res, data, sendCookie = false) => {
    if (sendCookie) {
        res.cookie('token', data.token, { httpOnly: true })
    }

    res.status(200).send({ code: 200, data: data})
}