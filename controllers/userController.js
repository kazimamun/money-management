const User = require('../model/User');
const registerValidator = require('../validator/registerValidator');
const loginValidator = require('../validator/loginValidator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { serverError, resourceError } = require('../util/error');

//login controller
module.exports = {
    login(req, res){
        let {email, password} = req.body;
        let validate = loginValidator({email, password});
        if (!validate.isValid){
            return res.status(400).json(validate.error)
        }
        User.findOne({email})
            .then(user => {
                if (!user){
                   return resourceError(res, "user not found")
                } else { //if user exist on database
                    bcrypt.compare(password, user.password, (err, result)=>{
                        if (err) {
                            serverError(res, err)
                        }
                        if (!result) { // if password not matched
                            resourceError(res, "Password dosen't matched")
                        }
                        //make token for provide user time for login
                        let token = jwt.sign({
                            _id : user._id,
                            name : user.name,
                            email : user.email
                        }, "SECRET", {expiresIn: "2h"})

                        res.status(200).json({
                            message: "login successfully",
                            token : `Barer ${token}`
                        })
                    })
                }
            })
            .catch(err=>serverError(res, err))
    },

    register(req, res){
        let {name, email, password, confirmPassword} = req.body;
        let validate = registerValidator({name, email, password, confirmPassword});
        if (!validate.isValid){
            return res.status(400).json(validate.error)
        } else { 
            User.findOne({email})
                .then(user=>{
                    if (user){
                        return resourceError(res, "Email Already Exist")
                    }

                    bcrypt.hash(password, 11, (err, hash)=>{
                        if(err){
                            return serverError(res, err)
                        }

                        let user = new User({
                            name,
                            email,
                            password : hash
                        })

                        user.save()
                            .then(user=>{
                                res.status(201).json({
                                    message: "User Created Successfully",
                                    user
                                })
                            })
                            .catch(error=>{
                                return serverError(res, err)
                            })
                    })
                })
                .catch(error=>serverError(res, error))
        }
    }
}