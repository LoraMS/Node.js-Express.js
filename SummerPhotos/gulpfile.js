/* eslint-disable no-console */

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

// const nodemon = require('gulp-nodemon');

const eslint = require('gulp-eslint');

gulp.task('run', () => {
    require('./server');
});

gulp.task('lint', () => {
    return gulp.src(['./app/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// // nodemon
// gulp.task('dev', ['run'], () => {
//     return nodemon({
//         script: 'server.js',
//         ext: 'js',
//         task: ['run'],
//     });
// });

// unit tests , integration tests with istanbul
gulp.task('pre-test', () => {
    return gulp.src([
        './server/config/**/*.js',
        './server/configurations/**/*.js',
        './server/controllers/**/*.js',
        './server/data/**/*.js',
        './server/db/**/*.js',
        './server/models/**/*.js',
        './server/routers/**/*.js',
        './server.js',
    ])
        .pipe(istanbul({
            includeUntested: true,
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('tests', ['pre-test'], () => {
    return gulp.src([
        './test/unit/**/*.js',
        './test/integration/**/*.js',
    ])
        .pipe(mocha({
            reporter: 'nyan',
        }))
        .pipe(istanbul.writeReports());
});

const config = {
    connectionString: 'mongodb://Admin:admin@ds143532.mlab.com:43532/summer',
    port: 3001,
};

gulp.task('test-server:start', () => {
    return Promise.resolve()
        .then(() => require('./server/db').init(config.connectionString))
        .then((db) => require('./server/data').init(db))
        .then((data) => require('./server/config').init(data))
        .then((app) => {
            app.listen(
                config.port,
                () => console.log(`Magic happends at :${config.port}`));
        });
});

const { MongoClient } = require('mongodb');

gulp.task('test-server:stop', () => {
    return MongoClient.connect(config.connectionString)
        .then((db) => {
            // return db.dropDatabase();
        });
});


// browser
gulp.task('tests:browser', ['test-server:start'], () => {
    return gulp.src('./test/browser/publications/**/*.js')
        .pipe(mocha({
            reporter: 'nyan',
            timeout: 100000,
        }))
        .once('end', () => {
            gulp.start('test-server:stop');
        });
});

