/* eslint-disable no-console */

const async = () => {
    return Promise.resolve();
};

const config = require('./server/configurations');

let numClients = 0;

// let server = null;
async()
.then(() => require('./server/db').init(config.connectionString))
    .then((db) => require('./server/data').init(db))
    .then((data) => require('./server/config').init(data))
    .then((app) => {
        return app.listen(config.port, () =>
            console.log(`Server listen on :${config.port}`));
    })
    .catch((err) => {
        console.log(err);
    });
