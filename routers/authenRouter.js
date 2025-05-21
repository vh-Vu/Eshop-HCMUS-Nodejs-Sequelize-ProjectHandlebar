const express = require("express");
const router = express.Router();
const authenController = require("../controllers/authenController");
const {body, getErrorMessage} = require("../controllers/validator");

router.get("/login",authenController.show);
router.post("/login",
    body("email").trim().notEmpty().withMessage("Email is required!").isEmail().withMessage("Invalid email address!"),
    body("password").trim().notEmpty().withMessage("Password is required!"),
    (req,res,next) => {
        const mess = getErrorMessage(req);
        if(mess) return res.render("login",{loginMessage: mess});
        next();
    },
    authenController.login);
router.get("/logout",authenController.logout);

//router.post("/register",authenController.register);

module.exports = router;