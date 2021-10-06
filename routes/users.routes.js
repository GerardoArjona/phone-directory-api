const express = require('express')
const users = require('../controllers/users.controllers');

const { authenticationMiddleware } = require('../middlewares/authenticateToken')

const router = express.Router();

router.post('/', users.signUp); //Create User
router.post('/contact/:userId', authenticationMiddleware, users.addContact); //Create Contact

module.exports = router