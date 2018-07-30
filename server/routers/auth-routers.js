const passport = require('passport');
const { Router } = require('express');

// const encryption = require('../utilities/encryption');

module.exports = function(app, data) {
    const router = new Router();
    const controller= require('../controllers/auth-controller')(data);

    router
        .get('/login', (req, res) => {
            return controller.getLoginForm(req, res);
        })
        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true,
                failureMessage: 'Invalid username or password',
            })
        )
        .get('/register', (req, res) => {
            return controller.getRegisterForm(req, res);
        })
        .post('/register', (req, res) => {
            return controller.signUp(req, res);
        })
        .get('/logout', (req, res) => {
            req.logout();
            return res.redirect('/');
        });

    app.use('/', router);
};

