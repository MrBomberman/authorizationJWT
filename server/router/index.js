const Router = require('express');
const userController = require('../controllers/userController.js');

const router =  new Router();
const {body} = require('express-validator'); // to check body of request
const authMiddleware = require('../middlewares/authMiddleware.js');

router.post('/registration',
    body('email').isEmail(), // choose body to check validation
    body('password').isLength({min: 3, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate) // to activate account
router.get('/refresh', userController.refresh) // to rewrite access token if it dies
router.get('/users', authMiddleware ,userController.getUsers) // to get full list of users

module.exports = router;