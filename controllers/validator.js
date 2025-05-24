const {body, validationResult} = require("express-validator");

function getErrorMessage(req){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorArray = errors.array();
        return errorArray.reduce((message,error)=> message + error.msg + "<br/>","");
    }
    return null; 
}

module.exports = {body,getErrorMessage};