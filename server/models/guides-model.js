class Guide {
    static isValid(model) {
        return typeof model !== 'undefined' &&
            typeof model.country === 'string' &&
            typeof model.info === 'string';
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
