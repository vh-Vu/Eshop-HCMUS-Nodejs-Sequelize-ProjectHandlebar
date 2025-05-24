const controller = {};
const { Model } = require("sequelize");
const passport = require("./passport");
const models = require("../models");
const { Result } = require("express-validator");


controller.isLogin = (req,res, next) => {
    if(req.isAuthenticated()) return next();
    return res.redirect(`/users/login?reqUrl=${req.originalUrl}`);

} 

controller.show = (req,res) =>{
    if(req.isAuthenticated())  return res.redirect("/");
    return res.render("login",{ loginMessage: req.flash("loginMessage"), reqUrl: req.query.reqUrl ,registerMessage: req.flash("registerMessage")});
}

controller.login = (req,res, next) =>{
    const keepSignedIn = req.body.keepSignedIn;
    const reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/my-account";
    const cart = req.session.cart;
    passport.authenticate("local-login", (error, user) => {
        if (error) return next(error);
        if (!user) return res.redirect(`/users/login?reqUrl=${req.originalUrl}`);

        req.logIn(user,(error) => {
            if (error) return next(error);
            req.session.cookie.maxAge = keepSignedIn ? (24*60*60*1000) : null;
            req.session.cart = cart;
            return res.redirect(reqUrl);
        });
    })(req,res,next);

}
controller.logout = (req,res,next) =>{
    const cart = req.session.cart;
    req.logout( error => {
        if (error) return mext(error);
        req.session.cart = cart;
        res.redirect("/");
    })
}


controller.register = async(req,res,next) =>{
    const cart = req.session.cart;
    const reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/my-account";
    passport.authenticate("local-register",(error, user) => {
        if (error) return next(error);
        if (!user) return res.redirect(`/users/login?reqUrl=${reqUrl}`);
        req.logIn(user,(error) => {
            if (error) return next(error);
            req.session.cart = cart;
            return res.redirect(reqUrl);
        });
    })(req,res,next);

};

controller.showForgotPage = (req,res) => res.render("forgot-password");

controller.forgot = async(req,res) =>{
    const email = req.body.email;
    const user = await models.User.findOne({where:{email}});
    if(user) {
        const {sign} = require("./jwt");
        const host = req.header("host");
        const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(email)}&email=${email}`;
        const {sendForgotPasswordMail} = require("./mail");
        sendForgotPasswordMail(user,host,resetLink).then((result) => {
            return res.render("forgot-password",{done:true});
        }).catch(err => {
            console.log(err)
            return res.render("forgot-password",{message:"An error has occured when sending to your email!"})
        })
         return res.render("forgot-password",{done:true});}
    return res.render("forgot-password",{message:"Email does not exists!"});
}


controller.showResetPassword = (req,res) =>{
    const email = req.query.email;
    const token = req.query.token;
    const {verify} = require("./jwt");
    if(!token || !verify(token)) return res.render("reset-password",{expired: true});
    return res.render("reset-password",{email,token});
}

controller.resetPassword = async(req,res) =>{
    const email = req.body.email;
    const token = req.body.token;
    const bcrypt = require("bcrypt");
    const password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8));
    console.log(password)
    await models.User.update(
        {password},
        {where: {email}}
    );
    return res.render("reset-password",{done:true});
}


module.exports = controller;