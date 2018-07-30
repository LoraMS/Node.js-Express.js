const { Router } = require('express');

module.exports = function(app, data) {
    const router = new Router();
    const controller = require('../controllers/user-controller')(data);

    router
        .get('/profile', (req, res) => {
            return controller.getUserProfile(req, res);
        })
        .get('/favourites', (req, res) => {
            return controller.getUserFavourites(req, res);
        })
        .post('/favourites', (req, res) => {
            return controller.addUserFavourites(req, res);
        })
        .delete('/favourites', (req, res) => {
            return controller.removeUserFavourites(req, res);
        });

    app.use('/user', router);
};
