const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')
const nsspi = require('../middleware/nSSPI')

//На случай работы без контроллера
/*router.get('/', (req, res) => {
  res.status(200).json({
    login: true
  })
})*/

/*router.post('/login', controller.login)
router.post('/register', controller.register)*/
router.get('/window', (r, re, n) => nsspi.nodesspi(r, re, n), controller.windowlogin)
router.post('/mailsend', controller.sendmail)

module.exports = router
