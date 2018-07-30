const { Router } = require('express');

module.exports = function(app, data) {
    const router = new Router();
    const controller = require('../controllers/destination-controller')(data);

    router
        .get('/', (req, res) => {
            return controller.getAll(req, res);
        })
        .get('/display', (req, res) => {
            return controller.displayDestinations(req, res);
        })
        .get('/:id', (req, res) => {
            return controller.getById(req, res);
        });

    app.use('/destinations', router);
};
