const express = require("express");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const verifyEmail = require("../controllers/emailVerifyController");
const profileController = require("../controllers/profileController");
const messageController = require("../controllers/messageController");
const peopleController = require("../controllers/peopleController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const resetPasswordController = require("../controllers/resetPasswordController");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:id/:token", resetPasswordController);
router.get("/:id/verify/:token", verifyEmail);
router.get("/profile", profileController.profileController);
router.get("/messages/:userId", messageController);
router.get("/people", peopleController);
router.put("/profile/update", profileController.profileUpdate);

module.exports = router;
