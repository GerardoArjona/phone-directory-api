const express = require('express')
const users = require('../controllers/users.controllers');

const router = express.Router();

router.post('/', users.signUp); //Create User

module.exports = router