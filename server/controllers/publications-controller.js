/* globals __dirname */
/* eslint max-len: ["error", 80] */
const { ObjectId } = require('mongodb').ObjectId;

const moment = require('moment');

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(path.dirname(__dirname));
const shelljs = require('shelljs');

// /* eslint-disable-line no-extend-native */
// const PUBLISHER_PUBLICATIONS_IMAGES_DIRECTORY =
// path.join(appDir, 'public/Publicated images');

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
                const user = req.user;

                return data.publications.getById(id)
                    .then((publication) => {
                        if (!publication) {
                            return res.render('errors/not-found');
                        }
                        publication.liked = false;
                        if (user) {
                            const favourites = req.user.favourites;
                            for (let i = 0; i < favourites.length; i++) {
                                if (favourites[i]._id === id) {
                                    publication.liked = true;
                                    break;
                                } else {
                                    // console.log('not liked');
                                }
                            }
                        }

                        return res.render('publication-views/publication', {
                            model: publication,
                        });
                    });
            },
            create(req, res) {
                const images = req.files;
                const image1 = images[0].path;
                const image2 = images[1].path;
                const image3 = images[2].path;              

                /*
[ { fieldname: 'image',
    originalname: 'food.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: './uploads/',
    filename: '2018-07-27T23-57-43.177Zfood.jpg',
    path: 'uploads\\2018-07-27T23-57-43.177Zfood.jpg',
    size: 72350 },
  { fieldname: 'image',
    originalname: 'ingredients.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: './uploads/',
    filename: '2018-07-27T23-57-43.182Zingredients.jpg',
    path: 'uploads\\2018-07-27T23-57-43.182Zingredients.jpg',
    size: 134888 },
  { fieldname: 'image',
    originalname: 'team-kitchen.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: './uploads/',
    filename: '2018-07-27T23-57-43.196Zteam-kitchen.jpg',
    path: 'uploads\\2018-07-27T23-57-43.196Zteam-kitchen.jpg',
    size: 90736 } ]
                */
                    const publication = req.body;
                    const user = req.user;
                    publication.likes = 0;
                    publication.dislikes = 0;
                    publication.comments = [];
                        
                    publication.publisher = user.firstname + ' ' + user.lastname;

                    const publisher = {
                        name: user.firstname + ' ' + user.lastname,
                        info: publication.publisherinfo,
                        comments: [],
                        };

                    const destination = {
                        destination: publication.destination,
                        };

                publication.image1 = image1;
                publication.image2 = image2;
                publication.image3 = image3;

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
                        return res.redirect('/publications');
                    })
                    .catch((error) => {
                        req.flash('error', error);
                        return res.redirect('/publications/form'); // eslint-disable-line
                    });
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
                return res.render('forms/publication-form');
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
                        req.flash('info',
                            'Your like was added successfully!');
                        return res.redirect('back');
                    })
                    .catch((err) => {
                        req.flash('error', err);
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
                        req.flash('info',
                            'Your like was added successfully!');
                        return res.redirect('back');
                    })
                    .catch((err) => {
                        req.flash('error', err);
                        return res.status(400);
                    });
            },
            removePublication(req, res) {
                const id = req.body.id;
                const publisher = req.user.username;
                const destination = req.body.destination;
                const username = req.user.username;

                data.publications.removeById(id);
                data.publishers.removeByQuery({ name: publisher }, { $pull: { publication: { _id: new ObjectId(id) } } });// eslint-disable-line
                data.destinations.removeByQuery({ destination: destination }, { $pull: { publications: { _id: new ObjectId(id) } } });// eslint-disable-line
                data.users.removeByQuery({ username: username }, { $pull: { publications: { _id: new ObjectId(id) } } });// eslint-disable-line

                return res.end();
                // req.method = 'GET';
                // req.url = '/publications';
                // res.req = req;
                // return res.redirect('/publications');
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
                const comment = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    date: moment().format('LL'),
                    text: req.body.textComment,
                };
                const id = req.params.id;

                if (comment.firstname === 'undefined' ||
                     typeof comment.firstname !== 'string') {
                    return Promise.reject('Invalid name. Please enter again!');
                }

                if (comment.lastname === 'undefined' ||
                     typeof comment.lastname !== 'string') {
                    return Promise.reject('Invalid name. Please enter again!');
                }

                if (comment.text === 'undefined' ||
                     typeof comment.text !== 'string') {
                    return Promise.reject('Comment must be a rext');
                }

                return data.publications.getById(id)
                    .then((dbPublication) => {
                        dbPublication.comments = dbPublication.comments || [];
                        dbPublication.comments.push(comment);

                        return data.publications.updateById(dbPublication);
                    })
                    .then(() => {
                        req.flash('info',
                            'Your comment was added successfully!'); // eslint-disable-line
                        return res.redirect('/publications/' + id);
                    })
                    .catch((err) => {
                        req.flash('error', err);
                        return res.status(400);
                    });
            },
    };
};
