var User = require('./../model/user.model');
var cryptoPasswordUtil = require('./../utils/crypto-password.util');
var successMessage = require('../services/successMessage');
var failMessage = require('../services/failMessage');
var jwtDecode = require('jwt-decode');

module.exports = {
    createUser: createUser,
    changePasswordUser: changePasswordUser,
    convertUserModelToUserResponse: convertUserModelToUserResponse
}

function convertUserModelToUserResponse(userModel) {
    var userObj = userModel.toObject();
    delete userObj.password;
    delete userObj.salt;
    return userObj;
}

function createUser(request, callback) {
    console.log(request);
    if (request.email ==="" || request.password === "" || request.username === "" || request.level === "") {
        callback({
            statusCode: 403,
            message: failMessage.user.create.inputs
        });
    } else {
        var password = cryptoPasswordUtil.cryptoPassword(request.password);
        User.findOne({ email: request.email }, function(err, user) {
            if (err) {
                callback({
                    message: failMessage.user.register.systemErr
                });
                console.log("error");
                return;
            }
            if (user !== null) {
                callback({
                    statusCode: 400,
                    message: failMessage.user.register.duplicateUser
                });
            }

            var newUser = User({
                email: request.email,
                password: password.hash,
                salt: password.salt,
                username: request.username,
                level: request.level
            });

            newUser.save(function(err, response) {
                if (err) {
                    console.log(err);
                    var error = {
                        message: failMessage.user.signup.systemErr
                    }

                } else {
                    callback(null, {
                        message: successMessage.user.signup,
                        user: convertUserModelToUserResponse(response)
                    });
                }
            });
        });
    }
}

function changePasswordUser(request, callback) {
    if (request.passwordOld === "" || request.getPasswordNew === "") {
        callback({
            statusCode: 403,
            message: failMessage.user.changePassword.input
        });
    } else {
        var token = request.token;
        var decoded = jwtDecode(token);
        var _id = decoded._id;
        console.log(decoded);


        User.findById({ _id: _id }, function(err, user) {
            if (err) {
                return;
            }
            if (user !== null) {
                if (cryptoPasswordUtil.verifyPassword(user.password, user.salt, request.passwordOld)) {
                    var passwordNew = cryptoPasswordUtil.cryptoPassword(request.passwordNew);
                    user.password = passwordNew.hash;
                    user.salt = passwordNew.salt;
                    //console.log(passwordNew);
                    user.save(function(err, res) {
                        if (err) {
                            return;
                        } else {
                            callback(null, {
                                message: successMessage.user.changePassword
                            })
                        }
                    })
                } else {
                    callback(null, {
                        message: failMessage.user.changePassword.passwordOldNotCorrect
                    });
                }
            }
        });
    }
}