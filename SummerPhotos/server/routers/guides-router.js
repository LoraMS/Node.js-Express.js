const { Router } = require('express');
const auth = require('../utilities/authinticated');

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

module.exports = function(app, data) {
    const router = new Router();
    const controller = require('../controllers/guide-controller')(data);

    router
        .get('/', (req, res) => {
            return controller.getAll(req, res);
        })
        .get('/form', auth.isInRole, (req, res) => {
            return controller.getGuideForm(req, res);
        })
        .get('/:id', (req, res) => {
            return controller.getById(req, res);
       })
       .post('/', upload.single("image"), (req, res) => {
        return controller.create(req, res);
        })
        .delete('/', (req, res) => {
            return controller.removeGuide(req, res);
        });

    app.use('/guides', router);
};
