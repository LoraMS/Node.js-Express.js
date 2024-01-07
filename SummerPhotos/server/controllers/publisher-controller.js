const MOST_POPULAR_COUNT = 4;
const moment = require('moment');

module.exports = function (data) {
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

                    res.render('publishers/publisher', {
                        model: publisher,
                        success: req.session.success,
                        errors: req.session.errors
                    });
                    req.session.errors = null;
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
            const textComment = req.body.textComment;
            const comment = {
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                date: moment().format('LL'),
                text: textComment,
            };
            const id = req.params.id;

            req.checkBody("textComment").notEmpty().withMessage("Comment is required.").isLength({ min: 2 }).withMessage("Comment must be at least 2 symbols long.").trim();

            var errors = req.validationErrors();
            if (errors) {
                req.session.errors = errors;
                req.session.success = false;
                res.redirect('/publishers/' + id);
            }
            else {
                req.session.success = true;

                return data.publishers.getById(id)
                    .then((dbPublisher) => {
                        dbPublisher.comments = dbPublisher.comments || [];
                        dbPublisher.comments.push(comment);

                        return data.publishers.updateById(dbPublisher);
                    })
                    .then(() => {
                        req.toastr.success('Your comment was added successfully!');
                        req.session.errors = null;
                        return res.redirect('/publishers/' + id);
                    })
                    .catch((error) => {
                        req.toastr.error(error);
                        return res.status(400);
                    });
            }
        },
    };
};
