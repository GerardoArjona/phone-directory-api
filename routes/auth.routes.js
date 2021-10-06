const express = require('express')
const users = require('../controllers/users.controllers');

const router = express.Router();

router.post('/login', users.signin); //Login User

module.exports = router