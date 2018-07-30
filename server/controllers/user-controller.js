const { ObjectId } = require('mongodb').ObjectId;

module.exports = function(data) {
    return {
        getUserProfile(req, res) {
            return res.render('user/profile');
        },
        getUserFavourites(req, res) {
            return res.render('user/favourites');
        },
        addUserFavourites(req, res) {
            const userId = req.user._id;
            const id = req.body.id;

            return data.users.findById(userId)
                .then((user) => {
                    user.favourites = user.favourites || [];

                    if (user.favourites.filter((x) => JSON.stringify(x._id) === JSON.stringify(new ObjectId(id))).length > 0) { // eslint-disable-line
                        return Promise.reject(`This publication
                         is already in your favourites.`);
                    }
                    user.favourites.push({
                        _id: new ObjectId(id),
                        image: req.body.image,
                        title: req.body.title,
                        date: req.body.date,
                        publisher: req.body.publisher,
                    });

                    return data.users.updateById(user);
                })
                .then(() => {
                    req.flash('info',
                        'Your favourites was added successfully!');
                    return res.redirect('back');
                })
                .catch((err) => {
                    req.flash('error', err);
                    return res.status(400);
                });
        },
        removeUserFavourites(req, res) {
            // const username = req.user.username;
            const id = req.body.id;

            data.users.findById(req.user._id)
                .then((user) => {
                    const favourites = user.favourites || [];

                    for (let i = 0; i < favourites.length; i++) {
                        if (JSON.stringify(favourites[i]._id) ===
                            JSON.stringify(id)) {
                            favourites.splice(i, 1);
                            data.users.updateById(user);
                            return res.end();
                        }
                    }

                    return data.users.updateById(user);
                })
                .then(() => {
                    // req.flash('info',
                    //     'Your favourites was added successfully!');
                    // return res.redirect('back');
                })
                .catch((err) => {
                    // req.flash('error', err);
                    // return res.status(400);
                });
        },
    };
};
