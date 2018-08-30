/* globals __dirname */
/* eslint max-len: ["error", { "ignoreStrings": true }] */

const path = require('path');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const toastr = require('express-toastr');
const config = require('./../configurations');

const init = (data) => {
    const app = express();

    app.set('view engine', 'pug');

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(favicon(path.join(__dirname, '../../public/images', 'favicon.ico')));
    app.use('/libs', express.static(path.join(__dirname, '../../node_modules')));
    app.use('/static', express.static(path.join(__dirname, '../../public')));
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

    require('./auth').init(app, data);

    app.use(require('connect-flash')());
    app.use((req, res, next) => {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    app.use(expressValidator());
    app.use(cookieParser());
    app.use(expressSession({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true
    }));
    app.use(flash());

    app.use(toastr());
    app.use(function (req, res, next)
    {
        res.locals.toasts = req.toastr.render();
        next();
    });

    require('../routers').attach(app, data);

    app.all('*', (req, res) => {
        res.status(404);
        res.render('errors/not-found');
    });

    return Promise.resolve(app);
};

module.exports = { init };
