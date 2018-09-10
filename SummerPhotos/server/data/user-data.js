const { ObjectId } = require('mongodb').ObjectId;
const BaseData = require('./base/base-data');
const UserModel = require('../models/user-model');

class UsersData extends BaseData {
    constructor(db) {
        super(db, UserModel, UserModel);
    }

    findByUsername(username) {
        const result = this.collection.findOne({
            username: new RegExp(username, 'i'),
        });

        return result;
    }

    findById(id) {
        const result = this.collection.findOne({
            _id: new ObjectId(id),
        });

        return result;
    }

    // checkPassword(username, password) {
    //     return this.collection
    //         .findOne({
    //             username,
    //         })
    //         .then((user) => {
    //             if (!user) {
    //                 throw new Error('Invalid user');
    //             }

    //             if (user.password !== password) {
    //                 throw new Error('Invalid password');
    //             }

    //             return true;
    //         });
    // }
}

module.exports = UsersData;
