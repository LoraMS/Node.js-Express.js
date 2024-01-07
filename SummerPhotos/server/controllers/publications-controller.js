/* globals __dirname */
/* eslint max-len: ["error", 80] */
const { ObjectId } = require('mongodb').ObjectId;
const moment = require('moment');

const LATEST_COUNT = 4;

module.exports = function(data) {
        return {
            getAll(req, res) {
                return data.publications.getAllSorted()
                    .then((publications) => {
                        return res
                            .render('publication-views/all-publications', {
                                model: publications,
                            });
                    });
            },
            getById(req, res) {
                const id = req.params.id;

                return data.publications.getById(id)
                    .then((publication) => {
                        if (!publication) {
                            return res.render('errors/not-found');
                        }

                        res.render('publication-views/publication', {
                            model: publication,
                            success: req.session.success,
                            errors: req.session.errors
                        });
                        req.session.errors = null;
                    });
            },
            create(req, res) {
                const images = req.files;
                let image1 = '';
                let image2 = '';
                let image3 = '';

                if(images.length === 3){
                    image1 = images[0].path;
                    image2 = images[1].path;
                    image3 = images[2].path;

                } else {
                    req.toastr.error("Only image files with extension .jpeg, .png, .jpg and .gif are allowed!");
                    res.redirect('publications/form');
                    return res.end();
                }         

                const publication = req.body;
                const user = req.user;
                publication.likes = 0;
                publication.dislikes = 0;
                publication.comments = [];

                publication.publisher = user.firstname + ' ' + user.lastname;
                publication.date = new Date().toISOString();

                publication.image1 = image1;
                publication.image2 = image2;
                publication.image3 = image3;

                const publisher = {
                    name: user.firstname + ' ' + user.lastname,
                    info: publication.publisherinfo,
                    comments: [],
                };

                const destination = {
                    destination: publication.destination,
                };

                req.checkBody("title", "Title must be at least 5 symbols long.").notEmpty().isLength({min: 5});

                req.checkBody("publisherinfo", "Info is required and must be at least 100 symbols long.").notEmpty().isLength({min: 100});

                req.checkBody("text1", "Description is required and must be at least 200 symbols long.").notEmpty().isLength({min: 200});

                req.checkBody("text2", "Description is required and must be at least 200 symbols long.").notEmpty().isLength({min: 200});

                req.checkBody("text3", "Description is required and must be at least 200 symbols long.").notEmpty().isLength({min: 200});
            
                var errors = req.validationErrors();
                if(errors){  
                    req.session.errors = errors;
                    req.session.success = false;
                    res.redirect('publications/form');
                } 
                else {
                    req.session.success = true;
                    
                return Promise
                    .all([
                        data.publications.create(publication),
                        data.publishers.findOrCreateBy(publisher),
                        data.destinations.findOrCreateBy(destination),
                    ])
                    .then(([dbPublication, dbPublisher, dbDestination]) => {  // eslint-disable-line
                        dbPublisher.name = publication.publisher;
                        dbPublisher.info = publication.publisherinfo;
                        dbPublisher.comments = [];

                        dbDestination.destination =
                            publication.destination;

                        dbPublisher.publication =
                            dbPublisher.publication || [];
                        dbPublisher.publication.push({
                            _id: dbPublication._id,
                            title: dbPublication.title,
                            image: dbPublication.image1,
                        });

                        user.publications = user.publications || [];
                        user.publications.push({
                            _id: dbPublication._id,
                            title: dbPublication.title,
                            image: dbPublication.image1,
                        });

                        dbDestination
                            .publications =
                            dbDestination.publications || [];
                        dbDestination.publications.push({
                            _id: dbPublication._id,
                            destination: dbPublication.destination,
                            title: dbPublication.title,
                            publisher: dbPublication.publisher,
                            date: dbPublication.date,
                            image: dbPublication.image1,
                        });

                        return Promise.all([
                            data.publications.updateById(dbPublication),
                            data.publishers.updateById(dbPublisher),
                            data.users.updateById(user),
                            data.destinations.updateById(dbDestination),
                        ]);
                    })
                    .then(() => {
                        req.toastr.success('Your publication was added successfully!')
                        req.session.errors = null;
                        return res.redirect('/publications');
                    })
                    .catch((error) => {
                        req.toastr.error('Error', error);
                        return res.redirect('/publications/form'); // eslint-disable-line
                    });
                }    
            },
            getLatestPublications(req, res) {
                return data.publications
                    .getLatest(LATEST_COUNT)
                    .then((publications) => {
                        return res
                            .send({
                                result: publications,
                            });
                    });
            },
            getPublicationForm(req, res) {
                // req.session.errors = null;
                res.render('forms/publication-form', { success: req.session.success, errors: req.session.errors });
                req.session.errors = null;
            },
            likePublication(req, res) {
                const id = req.body.id;

                return data.publications.getById(id)
                    .then((publication) => {
                        publication.likes = publication.likes + 1;

                        return data.publications
                            .updateById(publication);
                    })
                    .then(() => {
                        return res.redirect('back');
                    })
                    .catch((err) => {
                        return res.status(400);
                    });
            },
            dislikePublication(req, res) {
                const id = req.body.id;

                return data.publications.getById(id)
                    .then((publication) => {
                        publication.dislikes = publication.dislikes + 1;

                        return data.publications
                            .updateById(publication);
                    })
                    .then(() => {
                        return res.redirect('back');
                    })
                    .catch((err) => {
                        return res.status(400);
                    });
            },
            removePublication(req, res) {
                const id = req.body.id;
                const name = req.body.publisher;
                const destination = req.body.destination;
                const username = req.user.username;

                data.publications.removeById(id);
                data.publishers.removeByQuery({ name: name }, { $pull: { publication: { _id: new ObjectId(id) } } });// eslint-disable-line
                data.destinations.removeByQuery({ destination: destination }, { $pull: { publications: { _id: new ObjectId(id) } } });// eslint-disable-line
                data.users.removeByQuery({ username: username }, { $pull: { publications: { _id: new ObjectId(id) } } });// eslint-disable-line

                return res.end();
            },
            search(req, res) {
                const filter = req.query.search;
                return data.publications.getByFilter(filter)
                .then((publications) => {
                        if (!publications) {
                            return res.render('errors/not-found');
                        }
                        return res.render('publication-views/all-publications', {
                            model: publications,
                        });
                    });
            },
            addComment(req, res) {
                const textComment = req.body.textComment;
                const comment = {
                    firstname: req.user.firstname,
                    lastname: req.user.lastname,
                    date: moment().format('LL'),
                    text: textComment,
                };
                const id = req.params.id;
                
                req.checkBody("textComment", "Comment must be at least 2 symbols long.").notEmpty().isLength({min: 2}).trim();
                
                var errors = req.validationErrors();
                if(errors){
                    req.session.errors = errors;
                    req.session.success = false;
                    res.redirect('/publications/' + id);
                } 
                else {
                    req.session.success = true;

                return data.publications.getById(id)
                    .then((dbPublication) => {
                        dbPublication.comments = dbPublication.comments || [];
                        dbPublication.comments.push(comment);

                        return data.publications.updateById(dbPublication);
                    })
                    .then(() => {
                        req.toastr.success('Your comment was added successfully!');
                        req.session.errors = null;
                        return res.redirect('/publications/' + id);
                    })
                    .catch((error) => {
                        req.toastr.error(error);
                        return res.status(400);
                    });
                }
            },
    };
};
