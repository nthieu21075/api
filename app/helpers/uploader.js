const fs = require('fs')
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/' + Date.now()
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

exports.upload = multer({ storage: storage })

