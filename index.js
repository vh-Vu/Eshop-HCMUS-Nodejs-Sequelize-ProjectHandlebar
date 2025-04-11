const EXPRESS = require("express");
const PORT = 50505 
var app = EXPRESS()

app.get("/",(req,res)=>
    res.send("OK")
)

app.listen(PORT,() => {
    console.log("Sever starting at prot 50505");
})