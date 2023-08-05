const router = require("express").Router();
const GrammarController = require("../controller/GrammarController");

router.get("/", GrammarController.index);
router.post("/", GrammarController.createPreset);
router.post("/init", GrammarController.init);
module.exports = router;