const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");
const { where } = require("sequelize");

passport.serializeUser((user,done) => done(null, user.id));

passport.deserializeUser( async(id,done) => {
    try{
        let user = await models.User.findOne({
            where:{id},
            attributes : ["firstName","lastName","id","email","mobile","isAdmin"]
        });
        done(null,user);
    }
    catch (e){
        done(e,null);
    }
})

passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async(req,email,password,done)=>{
    if(email){
        email = email.toLowerCase();
    }
    try {
        if(!req.user){
            const user = await models.User.findOne({where: {email}});
            if(!user) return done(null,false, req.flash("loginMessage","Email does not exists!"));
            if(!bcrypt.compareSync(password,user.password)) return done(null,false, req.flash("loginMessage","Password is not match!"));
            return done(null,user);
        }  
        done(null,req.user);
        
    } catch (error) {    
        done(error,null);
    }
}));

module.exports = passport;