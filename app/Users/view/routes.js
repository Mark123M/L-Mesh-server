// eslint-disable-next-line new-cap
const router = require('express').Router();
const UserController = require('../controller/UserController');

router.get('/', UserController.index);
router.post('/', UserController.createUser);
router.post('/login', UserController.login);
module.exports = router;
