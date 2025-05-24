require("dotenv").config();
const EXPRESS = require("express");
const PORT = process.env.PORT; 
const app = EXPRESS()
const expressHBS = require("express-handlebars");
const {createRatingStar, formatDate} = require("./helper/helperHBS");
const { createPagination } = require("express-handlebars-paginate");
const session = require("express-session");
const passport = require("./controllers/passport");
const flash = require("connect-flash");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) =>  console.error("Redis error:", err));
redisClient.connect().catch(console.error);

const sessionStore = new RedisStore({
    client: redisClient,
    prefix: "sess:",
});


app.use(EXPRESS.static(__dirname + "/html"));
app.use(EXPRESS.json());
app.use(EXPRESS.urlencoded({extended: false}));


app.engine(
    "hbs",
    expressHBS.engine({
        layoutsDir: __dirname + "/views/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: {
            createRatingStar,
            formatDate,
            createPagination
        }
    })
);
app.set("view engine", "hbs");
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        maxAge: 60*60*1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next) =>{
    let cart = require("./controllers/cart");
    req.session.cart = new cart(req.session.cart ? req.session.cart : {} );
    res.locals.quantity  = req.session.cart.quantity;
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
})

app.use("/",require("./routers/indexRouter"));
app.use("/products",require("./routers/productsRouter"));
app.use("/users",require("./routers/authenRouter"));
app.use("/users",require("./routers/userRouter"));


app.use((req,res,next)=>{
    res.status(404).render("error", {
        message: "File not found!"
    });
});

app.use((error,req,res,next) => res.status(500).render("error", {message: "Internal Servel Error"}));

app.listen(PORT,() => {
    console.log(`Sever starting at port ${PORT}`);
})