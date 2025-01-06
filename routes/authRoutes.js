const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { route } = require('./personaRoutes')

router.post('/login',authController.iniciarSesion)

module.exports = router;