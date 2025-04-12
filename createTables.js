const model = require("./models");
model.sequelize.sync({force: true}).then(()=> {
    console.log("Created tables");
    process.exit();
}
)