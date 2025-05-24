const EXPRESS = require("express");
const router = EXPRESS.Router();
const userController = require("../controllers/userController");
const {body, validationResult} = require("express-validator");
const authenController = require("../controllers/authenController");


router.use(authenController.isLogin);
router.get("/checkout",userController.checkout);
router.post("/placeorders",
    body("firstName").notEmpty().withMessage("First name is required!"),
    body("lastName").notEmpty().withMessage("Last name is required!"),
    body("email").notEmpty().withMessage("Email is required!").isEmail().withMessage("Invalid email address!"),
    body("mobile").notEmpty().withMessage("Mobile No. is required!"),
    body("address").notEmpty().withMessage("Address is required!"),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const errorArray = errors.array();
            const messages = [];
            errorArray.forEach(err => {messages.push(err.msg); messages.push("<br/>")})
            return res.render("error",{message: messages.join("")});
        }
        next();
    },
    userController.placeOrders
);

router.get("/my-account", userController.myAccount);


module.exports = router;