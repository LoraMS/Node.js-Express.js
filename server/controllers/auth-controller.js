/* eslint max-len: ["error", { "ignoreStrings": true }] */

const moment = require('moment');
const encryption = require('../utilities/encryption');

module.exports = function(data) {
    return {
        getLoginForm(req, res) {
            return res.render('forms/signin-form');
        },
        getRegisterForm(req, res) {
            return res.render('forms/register-form');
        },
        signUp(req, res) {
            const salt = encryption.generateSalt();
            const passHash = encryption
                .generateHashedPassword(salt, req.body.password);
            const user = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                passHash: passHash,
                salt: salt,
                role: "read",
                publications: [],
                favourites: [],
                date: moment().format('LL'),
            };

            return data.users.findByUsername(user.username)
                .then((userByName) => {
                    if (userByName) {
                        return Promise.reject('User already exists');
                    }

                    const patternName = /^[a-zA-Z0-9]{2,40}$/;
                    if (!patternName.test(req.body.firstname) ||
                         !patternName.test(req.body.lastname)) {
                        return Promise.reject(`Name must contain only 
                        alphanumetrical symbols and must be 
                        between 2 and 40 symbols long.`);
                    }

                    const patternEmail = /^\w.+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/;
                    if (!patternEmail.test(req.body.email)) {
                           return Promise.reject(`Email can contain latin
                            letters, numbers, _ and .`);
                    }

                    const patternPassword =
                     /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                    if (!patternPassword.test(req.body.password)) {
                        return Promise.reject(`Password must be between
                        6 and 16 symbols long, must have at least one number
                        and at least one special character`);
                    }

                    if (req.body.password !== req.body.confirmpassword) {
                        return Promise
                        .reject(`Please confirm password correctly.`);
                    }

                    return data.users.create(user);
                })
                .then((userByName) => {
                    return res.redirect('/login');
                })
                .catch((err) => {
                    req.flash('error', err);
                    return res.redirect('/register');
                });
        },
    };
};
