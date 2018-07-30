/* globals process */

const sessionSecret = 'pink cat';

// eslint-disable-next-line no-process-env
const port = process.env.PORT || 3004;
// const connectionString = 'mongodb://localhost:27017/summer';
const connectionString = 'mongodb://admin:admin@ds239097.mlab.com:39097/summer-photos';

module.exports = {
    port, connectionString, sessionSecret,
};

