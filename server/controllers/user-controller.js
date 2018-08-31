const { ObjectId } = require('mongodb').ObjectId;

module.exports = function(data) {
    return {
        getUserProfile(req, res) {
            return res.render('user/profile');
        },
        getUserFavourites(req, res) {
            return res.render('user/favourites');
        },
        getUserPublications(req, res) {
            return res.render('user/publications');
        },
        addUserFavourites(req, res) {
            const userId = req.user._id;
            const id = req.body.id;
            const responseMessage = {
                message: '',
            };

            return data.users.findById(userId)
                .then((user) => {
                    user.favourites = user.favourites || [];

                    const isAlreadyAdded = user.favourites.filter((x) => JSON.stringify(x._id) === JSON.stringify(new ObjectId(id))).length > 0;

                    if (!isAlreadyAdded) {
                        user.favourites.push({
                            _id: new ObjectId(id),
                            image: req.body.image,
                            title: req.body.title,
                            date: req.body.date,
                            publisher: req.body.publisher,
                        });
    
                        responseMessage.message =  'not added';
                        return data.users.updateById(user);
                    }

                    responseMessage.message = 'already added';
                    return Promise.resolve();                    
                })
                .then(() => {
                    // req.flash('info',
                    //     'Your favourites was added successfully!');
                    res.status(200).json(responseMessage);
                    return res.redirect('back');
                })
                .catch((err) => {
                    req.toastr.error('error', err);
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
                    console.log(err);
                    req.toastr.error('error', err);
                    // return res.status(400);
                });
        },
    };
};
