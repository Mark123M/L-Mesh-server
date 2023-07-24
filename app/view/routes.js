const router = require("express").Router();
const GrammarController = require("../controller/GrammarController");

router.get("/", GrammarController.index);
module.exports = router;