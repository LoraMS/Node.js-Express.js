/* globals process */

const sessionSecret = 'pink cat';

const port = process.env.PORT || 3004;
// const connectionString = 'mongodb://localhost:27017/summer';
// const connectionString = 'mongodb://admin:admin@ds239097.mlab.com:39097/summer-photos';
const connectionString = process.env.MONGODB_URI || 'mongodb://admin:admin@summer-photos-shard-00-00.lsgel.mongodb.net:27017,summer-photos-shard-00-01.lsgel.mongodb.net:27017,summer-photos-shard-00-02.lsgel.mongodb.net:27017/summer-photos?ssl=true&replicaSet=atlas-bpz9qi-shard-0&authSource=admin&retryWrites=true&w=majority';

module.exports = {
    port, connectionString, sessionSecret,
};

