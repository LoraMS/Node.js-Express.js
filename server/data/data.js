const Publication = require('./publication-data');
const Publisher = require('./publisher-data');
const Destination = require('./destination-data');
const Guide = require('./guide-data');
const User = require('./user-data');

const init = (db) => {
    return Promise.resolve({
        publications: new Publication(db),
        publishers: new Publisher(db),
        destinations: new Destination(db),
        guides: new Guide(db),
        users: new User(db),
    });
};

module.exports = { init };
