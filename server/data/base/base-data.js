const { ObjectId } = require('mongodb').ObjectId;

class BaseData {
    constructor(db, ModelClass, validator) {
        this.db = db;
        this.ModelClass = ModelClass;
        this.validator = validator;
        this.collectionName = this._getCollectionName();
        this.collection = this.db.collection(this.collectionName);
    }

    getAll() {
        return this.collection.find()
            .toArray()
            .then((models) => {
                if (this.ModelClass.toViewModel) {
                        return models.map((model) =>
                                this.ModelClass.toViewModel(model));
                }
                return models;
            });
    }

    filterBy(props) {
        return this.collection.find(props).toArray();
    }

    create(model) {
        if (!this._isModelValid(model)) {
            return Promise.reject('Incorrect data!');
        }

        return this.collection.insert(model)
            .then(() => {
                return model;
            });
    }

    findOrCreateBy(props) {
        return this.filterBy(props)
            .then(([model]) => {
                if (!model) {
                    model = {};
                    return this.collection.insert(model)
                        .then(() => {
                            return model;
                        });
                }

                return model;
            });
    }

    updateById(model) {
        return this.collection.updateOne({
            _id: model._id,
        }, model);
    }

    removeById(id) {
        this.collection.remove({ _id: new ObjectId(id) });
    }

    removeByQuery(query, options ) {
        return this.collection.update(query, options);
    }

    _isModelValid(model) {
        if (typeof this.validator === 'undefined' ||
            typeof this.validator.isValid !== 'function') {
            return true;
        }

        return this.validator.isValid(model);
    }

    _getCollectionName() {
        return this.ModelClass.name.toLowerCase() + 's';
    }
}

module.exports = BaseData;
