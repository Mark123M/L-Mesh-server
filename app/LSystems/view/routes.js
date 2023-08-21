// eslint-disable-next-line new-cap
const router = require('express').Router();
const LSystemController = require('../controller/LSystemController');
const auth = require('../../../middleware/auth');

router.get('/', auth, LSystemController.index);
router.post('/', auth, LSystemController.createLSystem);
router.delete('/:id', auth, LSystemController.deleteLSystem);
module.exports = router;
