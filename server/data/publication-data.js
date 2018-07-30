const { ObjectId } = require('mongodb').ObjectId;
const BaseData = require('./base/base-data');
const PublicationModel = require('../models/publication-model');

class PublicationData extends BaseData {
    constructor(db) {
        super(db, PublicationModel, PublicationModel);
    }

    getAllSorted(){
        return this.collection.find()
            .sort({ date: -1 })
            .toArray()
            .then((models) => {
                if (this.ModelClass.toViewModel) {
                        return models.map((model) =>
                                this.ModelClass.toViewModel(model));
                }
                return models;
            });
    }

    getById(id) {
        const result = this.collection.findOne({ _id: new ObjectId(id) });

        return result;
    }

    getByFilter(filter) {
        const result = this.collection
        .find({ $or: [{ title: new RegExp(`.*${filter}.*`, 'gi' ) },
        { publisher: new RegExp(`.*${filter}.*`, 'gi' ) }] }).toArray();

        return result;
    }

    getLatest(count) {
        const result = this.collection
        .find({})
        .sort({ date: -1 })
        .limit(count)
        .toArray();
        return result;
    }
}

module.exports = PublicationData;
