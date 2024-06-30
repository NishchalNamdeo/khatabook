const express = require("express");
const router = express.Router();
const { isLoggedIn, redirectIfLoggedIn} = require("../middlewares/auth-middlewares");
const {createHisaabController, hisaabPageController} = require("../controllers/hisaab-controllers")

router.get("/create", isLoggedIn, hisaabPageController);
router.post("/create", isLoggedIn, createHisaabController);



module.exports = router;