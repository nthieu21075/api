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

exports.responseData = (res, data, sendCookie = false, token = null) => {
    if (sendCookie) {
        return res.status(200).send({ code: 200, data: data, token: token })
    }

    res.status(200).send({ code: 200, data: data })
}