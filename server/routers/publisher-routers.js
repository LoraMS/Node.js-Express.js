const { Router } = require('express');
const auth = require('../utilities/authinticated');

module.exports = function(app, data) {
    const router = new Router();
    const controller = require('../controllers/publisher-controller')(data);

    router
        .get('/', (req, res) => {
            return controller.getAll(req, res);
        })
        .get('/mostpopular', (req, res) => {
            return controller.getMostPopolarPublishers(req, res);
        })
        .get('/:id', (req, res) => {
            return controller.getById(req, res);
        })
        .post('/:id/comments', auth.isAuthenticated, (req, res) => {
            return controller.addComment(req, res);
        });

    app.use('/publishers', router);
};

