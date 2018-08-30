const { ObjectId } = require('mongodb').ObjectId;

module.exports = function (data) {
    return {
        getAll(req, res) {
            return data.guides.getAll()
                .then((guides) => {
                    return res
                        .render('guides/all-guides', {
                            model: guides,
                        });
                });
        },
        getById(req, res) {
            const id = req.params.id;

            return data.guides.getById(id)
                .then((guide) => {
                    if (!guide) {
                        return res.render('errors/not-found');
                    }
                    return res.render('guides/guide', {
                        model: guide,
                    });
                });
        },
        getGuideForm(req, res) {
            // req.session.errors = null;
            res.render('forms/guide-form', { success: req.session.success, errors: req.session.errors });
            req.session.errors = null;
        },
        create(req, res) {
            const image = req.file.path;
            const guide = req.body;
            guide.image = image;

            const destination = {
                destination: guide.destination,
            };

            const country = guide.country;
            const info = guide.info;
            const accommodation = guide.accommodation;
            const food = guide.food;
            const transportation = guide.transportation;
            const activities = guide.activities;

            req.checkBody("country", "Country must be at least 3 symbols long.").notEmpty().isLength({min: 3});

            req.checkBody("info", "Info is required and must be at least 20 symbols long.").notEmpty().isLength({min: 20});

            req.checkBody("accommodation", "Accommodation is required and must be at least 100 symbols long.").notEmpty().isLength({min: 100});

            req.checkBody("food", "Food is required and must be at least 100 symbols long.").notEmpty().isLength({min: 100});

            req.checkBody("transportation", "Transportation are required and must be at least 100 symbols long.").notEmpty().isLength({min: 100});

            req.checkBody("activities", "Activities are required and must be at least 100 symbols long.").notEmpty().isLength({min: 100});
        
            var errors = req.validationErrors();
            if(errors){
                req.session.errors = errors;
                req.session.success = false;
                res.redirect('guides/form');
            } 
            else {
                req.session.success = true;
            
            return Promise
                .all([
                    data.guides.create(guide),
                    data.destinations.findOrCreateBy(destination),
                ])
                .then(([dbGuide, dbDestination]) => {              
                    dbDestination.destination = guide.destination;
                    dbDestination.guides = dbDestination.guides || [];
                    dbDestination.guides.push({
                        _id: dbGuide._id,
                        country: dbGuide.country,
                        destination: dbGuide.destination,
                        image: dbGuide.image,
                    });
                    
                    return Promise.all([
                        data.guides.updateById(dbGuide),
                        data.destinations.updateById(dbDestination),
                    ]);
                })
                .then(() => {
                    req.toastr.success('Guide added successfully!');
                    return res.redirect('/guides');
                })
                .catch((error) => {
                    req.toastr.error('Please try again later!', error);
                    return res.redirect('/guides/form'); // eslint-disable-line
                });
            }
        },
        removeGuide(req, res) {
            const id = req.body.id;
            const destination = req.body.destination;

            data.guides.removeById(id),
            data.destinations.removeByQuery({ destination: destination }, { $pull: { guides: { _id: new ObjectId(id) } } })// eslint-disable-line
                
            return res.end();
        },
    };
};