const BaseData = require('./base/base-data');
const { ObjectId } = require('mongodb').ObjectId;
const DestinationModel = require('../models/destination-model');

class DestinationData extends BaseData {
    constructor(db) {
        super(db, DestinationModel, DestinationModel);
    }

    getById(id) {
        const result = this.collection.findOne({ _id: new ObjectId(id) });

        return result;
    }
}

module.exports = DestinationData;
