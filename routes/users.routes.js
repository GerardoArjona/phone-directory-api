const express = require('express')
const users = require('../controllers/users.controllers');

const { authenticationMiddleware } = require('../middlewares/authenticateToken')

const router = express.Router();

router.post('/', users.signUp); //Create User
router.post('/contacts', authenticationMiddleware, users.addContact); //Create Contact
router.get('/contacts', authenticationMiddleware, users.listContactsFromUser) // Get all contacts from user
router.get('/contacts/:contactId', authenticationMiddleware, users.getContactById) // Get contact by id

module.exports = router