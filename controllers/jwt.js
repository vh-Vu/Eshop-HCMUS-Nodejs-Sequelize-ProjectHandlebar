require("dotenv").config();
const jwt = require("jsonwebtoken");

function sign(email, expiresIn = "30m"){
    return jwt.sign(
        {email},
        process.env.JWT_SECERT,
        {expiresIn}
    )
}

function verify(token){
    try {
        jwt.verify(token,process.env.JWT_SECERT)
        return true;
    } catch (error) {
        return false;
    }
}
module.exports = {sign, verify};