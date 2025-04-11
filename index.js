const EXPRESS = require("express");
const PORT = 50505 
const app = EXPRESS()
const expressHBS = require("express-handlebars");

app.use(EXPRESS.static(__dirname + "/html"));
app.engine(
    "hbs",
    expressHBS.engine({
        layoutsDir: __dirname + "/views/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        }
    })
);
app.set("view engine", "hbs");
app.use(EXPRESS.json());


app.get("/",(req,res)=>
    res.render("index")
);
app.get("/product-list",(req,res)=>
    res.render("product-list")
);

app.get("/product-detail",(req,res)=>
    res.render("product-detail")
);

app.get("/checkout",(req,res)=>
    res.render("checkout")
);

app.get("/login",(req,res)=>
    res.render("login")
);
app.get("/my-account",(req,res)=>
    res.render("my-account")
);
app.get("/wishlist",(req,res)=>
    res.render("wishlist")
);
app.get("/cart",(req,res)=>
    res.render("cart")
);
app.get("/contact",(req,res)=>
    res.render("contact")
);

app.listen(PORT,() => {
    console.log("Sever starting at prot 50505");
})