const express = require('express')
const users = require('../controllers/users.controllers');

const { authenticationMiddleware } = require('../middlewares/authenticateToken')

const router = express.Router();

router.post('/', users.signUp); //Create User
router.post('/contacts/:userId', authenticationMiddleware, users.addContact); //Create Contact
router.get('/contacts/:userId', authenticationMiddleware, users.listContacts)

module.exports = router