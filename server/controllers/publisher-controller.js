const MOST_POPULAR_COUNT = 4;
const moment = require('moment');

module.exports = function(data) {
    return {
        getAll(req, res) {
            return data.publishers.getAll()
                .then((publishers) => {
                    return res
                        .render('publishers/all-publishers', {
                            model: publishers,
                        });
                });
        },
        getById(req, res) {
            const id = req.params.id;

            return data.publishers.getById(id)
                .then((publisher) => {
                    if (!publisher) {
                        return res.render('errors/not-found');
                    }
                    return res.render('publishers/publisher', {
                        model: publisher,
                    });
                });
        },
        getMostPopolarPublishers(req, res) {
            return data.publishers
                .getMostPopolarPublishers(MOST_POPULAR_COUNT)
                .then((publishers) => {
                    return res
                        .send({
                            result: publishers,
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

                return data.publishers.getById(id)
                    .then((dbPublisher) => {
                        dbPublisher.comments = dbPublisher.comments || [];
                        dbPublisher.comments.push(comment);

                        return data.publishers.updateById(dbPublisher);
                    })
                    .then(() => {
                        req.flash('info',
                            'Your comment was added successfully!'); // eslint-disable-line
                        return res.redirect('/publishers/' + id);
                    })
                    .catch((err) => {
                        req.flash('error', err);
                        return res.status(400);
                    });
            },
    };
};
