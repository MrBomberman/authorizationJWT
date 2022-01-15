const Router = require('express');
const userController = require('../controllers/userController.js');

const router =  new Router();

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate) // to activate account
router.get('/refresh', userController.refresh) // to rewrite access token if it dies
router.get('/users', userController.getUsers) // to get full list of users

module.exports = router;