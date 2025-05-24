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

passport.use("local-register", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async(req,email,password,done)=>{
    if(email){
        email = email.toLowerCase();
    }
    if(req.user){
        return done(null,req.user);
    }
    try {
        let user = await models.User.findOne({where: {email}});
        if(user) return done(null,false,req.flash("registerMessage","Email is already taken!"));
        user = await models.User.create({
            email: email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: req.body.mobile
        })
        return done(null,false,req.flash("registerMessage","Register is sussessfully!"));
    } catch (error) {
        done(error,null);
    }
}))

module.exports = passport;