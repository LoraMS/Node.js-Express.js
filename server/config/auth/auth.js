const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local');
const encryption = require('../../utilities/encryption');

const config = require('../../configurations');

const init = (app, { users }) => {
    // must be always on the top
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    },
    (username, password, done) =>{
        return users.findByUsername(username)
            .then((user) => {
                if (!user) {
                    return done(null, false, { message: 'User not exist!' });
                }

                if (user.username !== username) {
                        return done(null, false,
                            { message: 'Incorrect username or password!' });
                    }

                const passHash = encryption
                .generateHashedPassword(user.salt, password);

                if (user.passHash !== passHash) {
                    return done(null, false,
                        { message: 'Incorrect username or password!' });
                }
                return done(null, user);
            });
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        'extended': true,
    }));
    app.use(session({
        secret: config.sessionSecret,
        store: new MongoStore({
            url: config.connectionString,
            ttl: 14 * 24 * 60 * 60, // = 14 days. Default
        }),
        resave: true,
        saveUninitialize: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        return users.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(done);
    });

    app.use((req, res, next) => {
        res.locals = {
            user: req.user,
        };

        next();
    });
};

module.exports = { init };
