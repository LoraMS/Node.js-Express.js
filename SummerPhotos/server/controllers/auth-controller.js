/* eslint max-len: ["error", { "ignoreStrings": true }] */

const moment = require('moment');
const encryption = require('../utilities/encryption');

module.exports = function (data) {
    return {
        getLoginForm(req, res) {
            return res.render('forms/signin-form');
        },
        getRegisterForm(req, res) {
            res.render('forms/register-form', { success: req.session.success, errors: req.session.errors });
            req.session.errors = null;
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

            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const confirmpassword = req.body.confirmpassword;

            req.checkBody("firstname")
                .notEmpty().withMessage("First name can not be empty!")
                .isLength({ min: 2 }).withMessage("First name must be at least 2 symbols long!")
                .isLength({ max: 20 }).withMessage("First name must be max 20 symbols long!")
                .isAlpha().withMessage("First name must contain only letters!");

            req.checkBody("lastname")
                .notEmpty().withMessage("Last name can not be empty!")
                .isLength({ min: 2 }).withMessage("Last name must be at least 2 symbols long!")
                .isLength({ max: 20 }).withMessage("Last name must be max 20 symbols long!")
                .isAlpha().withMessage("Last name must contain only letters!");

            req.checkBody("username")
                .notEmpty().withMessage("Username can not be empty!")
                .isLength({ min: 2 }).withMessage("Username must be at least 2 symbols long!")
                .isLength({ max: 20 }).withMessage("Username must be max 20 symbols long!");

            req.checkBody("email")
                .notEmpty().withMessage("Email can not be empty!")
                .isEmail().withMessage("Please provide valid email address!");

            req.checkBody("password")
                .notEmpty().withMessage("Password can not be empty!")
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!')
                .isLength({ max: 16 }).withMessage('Password must be max 16 characters long!')
                .matches('[a-zA-Z]').withMessage('Password must contain at least 1 one letter!')
                .matches('[0-9]').withMessage('Password must contain at least 1 number!')
                .matches('[!@#$%^&*]').withMessage('Password must contain at least 1 one special character!');

            req.checkBody("confirmpassword")
                .notEmpty().withMessage("Confirm password can not be empty!")
                .equals(password).withMessage("Confirm password must matches with password!");

            var errors = req.validationErrors();
            console.log(errors)
            if (errors) {
                req.session.errors = errors;
                req.session.success = false;
                res.redirect('/register');
            }
            else {
                req.session.success = true;

                data.users.findByUsername(user.username)
                    .then((userByName) => {
                        if (userByName) {
                            return Promise.reject('User already exists');
                        }

                        return data.users.create(user);
                    })
                    .then((userByName) => {
                        req.toastr.success('Registration successfully.');
                        req.session.errors = null;
                        return res.redirect('/login');
                    })
                    .catch((err) => {
                        req.toasrt.error('error', err);
                        return res.redirect('/register');
                    });
                }
            },
        };
    };
