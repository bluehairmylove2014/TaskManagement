const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');

const {
    handleLogin,
    handleRegister,
    checkLogin,
    // loginWithGoogle
} = require("../controllers/auth.controller");

// router.get("/loginWithGoogle", loginWithGoogle);
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/checkLogin", authenticateJWT, checkLogin);

module.exports = router;