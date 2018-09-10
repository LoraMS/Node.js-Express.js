module.exports = function(data) {
    return {
        getAll(req, res) {
            return data.destinations.getAll()
                .then((destinations) => {
                    return res
                        .render('destinations/all-destinations', {
                            model: destinations,
                        });
                });
        },
        getById(req, res) {
            const id = req.params.id;

            return data.destinations.getById(id)
                .then((destination) => {
                    if (!destination) {
                        return res.render('errors/not-found');
                    }
                    return res.render('destinations/destination', {
                        model: destination,
                    });
                });
        },

        displayDestinations(req, res) {
            return data.destinations.getAll()
                .then((destinations) => {
                    if (!destinations) {
                        return res.render('errors/not-found');
                    }
                    return res.send({
                        result: destinations,
                    });
                });
        },
    };
};
