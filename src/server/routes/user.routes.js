var router = require('express').Router();
var userDao = require('./../dao/user.dao');
var middleware_jwt = require("../middlewares/jwt");

module.exports = function() {

    router.post('/create', createUser);
    router.post('/change', middleware_jwt.authentication, changePasswordUser);
    router.get('/get', getUser);

    function getUser(req, res) {

    }

    function createUser(req, res, next) {
        var request = {
            email: req.body.email,
            password: req.body.password,
            level: req.body.level
        };
        userDao.createUser(request, function(err, reponse) {
            if (err) { next(err); } else {
                res.status(200).send(reponse).end();
            }
        });
    }

    function changePasswordUser(req, res, next) {
        var request = {
            passwordOld: req.body.passwordOld,
            passwordNew: req.body.passwordNew,
            token: req.body.token || req.query.token || req.headers['x-access-token']
        };
        userDao.changePasswordUser(request, function(err, response) {
            if (err) {
                next(err);
            } else {
                res.status(200).send(response).end();
            }
        });
    }
    return router;
};