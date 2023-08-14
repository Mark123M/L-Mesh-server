// eslint-disable-next-line new-cap
const router = require('express').Router();
const LSystemController = require('../controller/LSystemController');
const auth = require('../../../middleware/auth');

router.get('/', LSystemController.index);
router.post('/', auth, LSystemController.createPreset);
module.exports = router;
