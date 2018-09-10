const { Router } = require('express');

module.exports = function(app, data) {
    const router = new Router();
    const controller = require('../controllers/home-controller')(data);

    router
        .get('/', (req, res) => {
            return controller.getHomePage(req, res);
        })
        .get('/home', (req, res) => {
            return controller.getHomePage(req, res);
        })
        .get('/contact', (req, res) => {
            return controller.getContactForm(req, res);
        })
        .post('/contact', (req, res) => {
            return controller.postContactForm(req, res);
        });

    app.use('/', router);
};
