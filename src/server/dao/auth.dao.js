var user = require('./../model/user.model');
var cryptoPasswordUtil = require('./../utils/crypto-password.util');
var jwt = require('./../utils/jwt.util');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var userDao = require('.././dao/user.dao');
var emailValidate = require('./../utils/emailValidate');
var jwtDecode = require('jwt-decode');

console.log(successMessage);
module.exports = {
    signin: signin,
    signup: signup,
    resetPassword: resetPassword,
    sendEmail: sendEmail
};

function signin(request, callback) {
    // console.log(request);
    if (!request.email || !request.password) {
        callback({
            statusCode: 403,
            message: failMessage.user.login.input
        });
    } else {
        user.findOne({ email: request.email }, function(err, user) {
            // console.log('123');
            if (err) {
                callback({
                    message: failMessage.user.login.systemErr
                });
            } else if (!user) {
                callback({
                    statusCode: 404,
                    message: failMessage.user.login.notFound
                });
            } else {
                if (cryptoPasswordUtil.verifyPassword(user.password, user.salt, request.password)) {
                    var token = jwt.signToken(userDao.convertUserModelToUserResponse(user));
                    callback(null, {
                        message: successMessage.user.login,
                        "email": userDao.convertUserModelToUserResponse(user),
                        "token": token
                    });
                    var jwtDecode = require('jwt-decode');
                } else {
                    callback({
                        statusCode: 400,
                        message: failMessage.user.login.inCorrect
                    });
                }
            }
        });
    }
}

function signup(request, callback) {
    userDao.createUser(request, function(err, response) {
        if (err) {
            if (err.message === failMessage.user.create.input) {
                err.message = failMessage.user.register.input;
            }
            console.log(err);
            callback(err);
        } else {
            response.message = successMessage.user.register;
            callback(null, response);
        }
    });
}

function sendEmail(request, callback) {
    if (!request.email) {
        callback({
            statusCode: 403,
            message: failMessage.user.login.input
        });
    } else {
        user.findOne({ email: request.email }, function(err, email) {
            if (err) {
                callback({
                    message: failMessage.user.login.systemErr
                });
            } else if (!email) {
                callback({
                    statusCode: 404,
                    message: failMessage.user.login.notFound
                });
            } else {
                var req = {
                    email: request.email
                }
                var token = jwt.signToken(req);
                emailValidate.sendMail(request.email, token);
                callback(null, {
                    message: successMessage.user.sendEmail
                });
            }
        })


    }
}

function resetPassword(request, callback) {
    if (!request.newPassword || !request.token) {
        callback({
            statusCode: 403,
            message: failMessage.user.login.input
        });
    } else {
        var token = request.token;
        var decoded = jwtDecode(token);
        var email = decoded.email;
        console.log(decoded);

        user.findOne({ email: email }, function(err, user) {
            if (err) {
                callback({
                    message: failMessage.user.login.systemErr
                });
            } else if (!user) {
                callback({
                    statusCode: 404,
                    message: failMessage.user.login.notFound
                });
            } else {
                var newPassword = cryptoPasswordUtil.cryptoPassword(request.newPassword);
                user.password = newPassword.hash;
                user.salt = newPassword.salt;
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
            }

        });
    }
}