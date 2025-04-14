const EXPRESS = require("express");
const PORT = 50505 
const app = EXPRESS()
const expressHBS = require("express-handlebars");
const {createRatingStar} = require("./helper/helperHBS");

app.use(EXPRESS.static(__dirname + "/html"));
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
        }
    })
);
app.set("view engine", "hbs");
app.use(EXPRESS.json());


app.use("/",require("./routers/indexRouter"));
app.use("/products",require("./routers/productsRouter"));

app.use((req,res,next)=>{
    res.status(404).send("File not found!");
});

app.use((error,req,res,next) =>
    res.status(500).send("Internal Servel Error")
);

app.listen(PORT,() => {
    console.log("Sever starting at prot 50505");
})