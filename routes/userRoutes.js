const { login, register } = require('../controllers/userController');

const router = require('express').Router();

//Registration Routes
router.post('/register', register)

//Login Routes
router.post('/login', login)


module.exports = router;