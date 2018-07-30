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
            return res.render('forms/guide-form');
        },
        create(req, res) {
            const image = req.file.path;
            const guide = req.body;
            guide.image = image;

            const destination = {
                destination: guide.destination,
            };

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
                    return res.redirect('/guides');
                })
                .catch((error) => {
                    req.flash('error', error);
                    return res.redirect('/guides/form'); // eslint-disable-line
                });
        },
    };
};