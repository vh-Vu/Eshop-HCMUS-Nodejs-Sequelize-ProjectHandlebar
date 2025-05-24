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

router.post("/register",
    body("firstName").trim().notEmpty().withMessage("First name is required!"),
    body("lastName").trim().notEmpty().withMessage("Last name is required!"),
    body("email").trim().notEmpty().withMessage("Email is required!").isEmail().withMessage("Invalid email address!"),
    body("password").trim().notEmpty().withMessage("Password is required!"),
    body("password").matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage("Password Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters!"),
    body("confirmPassword").custom( (confirmPassword,{req} ) => {
        if (confirmPassword!= req.body.password) throw new Error ("Password is not match!");
        return true;
    }),
    (req,res,next) => {
        const mess = getErrorMessage(req);
        if(mess) return res.render("login",{registerMessage: mess});
        next();
    },
    authenController.register);

router.get("/forgot",authenController.showForgotPage);

router.post("/forgot",
    body("email").trim().notEmpty().withMessage("Email is required!").isEmail().withMessage("Invalid email address!"),
    (req,res,next) => {
        const mess = getErrorMessage(req);
        if(mess) return res.render("forgot-password",{message: mess});
        next();
    },
    authenController.forgot);
router.get("/reset", authenController.showResetPassword);
router.post("/reset", 
    body("email").trim().notEmpty().withMessage("Email is required!").isEmail().withMessage("Invalid email address!"),
    body("password").trim().notEmpty().withMessage("Password is required!"),
    body("password").matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage("Password Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters!"),
    body("confirmPassword").custom( (confirmPassword,{req} ) => {
        if (confirmPassword!= req.body.password) throw new Error ("Password is not match!");
        return true;
    }),
    (req,res,next) => {
        const mess = getErrorMessage(req);
        if(mess) return res.render("reset-password",{message: mess});
        next();
    },
    authenController.resetPassword)

module.exports = router;