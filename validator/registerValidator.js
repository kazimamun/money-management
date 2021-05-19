const validator = require('validator');

const validate = user =>{
    let error = {};

    if (!user.name){
        error.name = 'Please Provide Your Name'
    } 
    if (!user.email){
        error.email = 'Please Provide Your Valid Email'
    } else if (!validator.isEmail(user.email)){
        error.email = "Please Provide a Valid Email"
    }
    if (!user.password){
        error.password = 'Please Provide a Password'
    } else if (user.password.length <6 ){
        error.password = "Password Must be Six Character or Upper"
    }
    if (!user.confirmPassword){
        error.confirmPassword = "Please Provide Confirm Password"
    } else if (user.password !== user.confirmPassword){
        error.confirmPassword= "Password doesn't matched"
    }
    return{
        error,
        isValid: Object.keys(error).length === 0
    }
};

module.exports = validate;