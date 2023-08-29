// eslint-disable-next-line new-cap
const router = require('express').Router();
const UserController = require('../controller/UserController');

router.get('/me', UserController.index);
router.post('/', UserController.createUser);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
module.exports = router;
