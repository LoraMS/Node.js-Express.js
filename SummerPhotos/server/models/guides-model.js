class Guide {
    static isValid(model) {
        return typeof model !== 'undefined' &&
            typeof model.country === 'string' &&
            typeof model.destination === 'string' &&
            typeof model.info === 'string' &&
            typeof model.accommodation === 'string' &&
            typeof model.food === 'string' &&
            typeof model.transportation === 'string' &&
            typeof model.activities === 'string';
    }

    static toViewModel(model) {
        const viewModel = new Guide();

        Object.keys(model)
            .forEach((prop) => {
                viewModel[prop] = model[prop];
            });

        return viewModel;
    }

     get id() {
        return this._id;
    }
}

module.exports = Guide;
