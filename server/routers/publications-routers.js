/* eslint max-len: ["error", { "ignoreStrings": true }] */

const { Router } = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter});
const auth = require('../utilities/authinticated');

module.exports = function(app, data) {
    const router = new Router();
    const controller = require('../controllers/publications-controller')(data);

    router
        .get('/', (req, res) => {
            return controller.getAll(req, res);
        })
        .get('/form', auth.isAuthenticated, (req, res) => {
             return controller.getPublicationForm(req, res);
        })
        .get('/latest', (req, res) => {
            return controller.getLatestPublications(req, res);
        })
        .get('/search', (req, res) => {
            return controller.search(req, res);
        })
        .get('/:id', (req, res) => {
            return controller.getById(req, res);
        })
        .post('/', upload.any(), (req, res) => {
            return controller.create(req, res);
        })
        .post('/like', (req, res) => {
            return controller.likePublication(req, res);
        })
        .post('/dislike', (req, res) => {
            return controller.dislikePublication(req, res);
        })
        .post('/:id/comments', auth.isAuthenticated, (req, res) => {
            return controller.addComment(req, res);
        })
        .delete('/', (req, res) => {
            return controller.removePublication(req, res);
        });

    app.use('/publications', router);
};

