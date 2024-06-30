const express = require("express");
const router = express.Router();
const { landingpageController, 
    registerPageController, 
    registerController,
    loginController, 
    logoutController,
    profileController} = require("../controllers/index-controller");
const {isLoggedIn, redirectIfLoggedIn } = require("../middlewares/auth-middlewares");

router.get("/", redirectIfLoggedIn, landingpageController);
router.get("/register", registerPageController);
router.get("/logout", logoutController);
router.get("/profile", isLoggedIn, profileController);


router.post("/register", registerController);
router.post("/login", loginController);


module.exports = router;