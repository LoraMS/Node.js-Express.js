const BaseData = require('./base/base-data');
const { ObjectId } = require('mongodb').ObjectId;
const GuideModel = require('../models/guides-model');

class GuideData extends BaseData {
    constructor(db) {
        super(db, GuideModel, GuideModel);
    }

    getById(id) {
        const result = this.collection.findOne({ _id: new ObjectId(id) });

        return result;
    }
}

module.exports = GuideData;
