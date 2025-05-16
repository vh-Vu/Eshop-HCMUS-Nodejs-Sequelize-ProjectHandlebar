const EXPRESS = require("express");
const PORT = 50505 
const app = EXPRESS()
const expressHBS = require("express-handlebars");
const {createRatingStar, formatDate} = require("./helper/helperHBS");
const { createPagination } = require("express-handlebars-paginate");
const session = require("express-session");


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
    secret: 'hamming_distance',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        maxAge: 60*60*1000
    }
}));

app.use((req,res,next) =>{
    let cart = require("./controllers/cart");
    req.session.cart = new cart(req.session.cart ? req.session.cart : {} );
    res.locals.quantity  = req.session.cart.quantity;
    next();
})


app.use("/",require("./routers/indexRouter"));
app.use("/products",require("./routers/productsRouter"));
app.use("/cart",require("./routers/cartRouter"));

app.use((req,res,next)=>{
    res.status(404).send("File not found!");
});

app.use((error,req,res,next) =>
    res.status(500).send("Internal Servel Error")
);

app.listen(PORT,() => {
    console.log("Sever starting at prot 50505");
})