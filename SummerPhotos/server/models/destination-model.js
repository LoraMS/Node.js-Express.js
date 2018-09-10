class Destination {
    static isValid(model) {
        return typeof model !== 'undefined' &&
        typeof model.destination === 'string' &&
        typeof model.info === 'string';
    }

    static toViewModel(model) {
        const viewModel = new Destination();

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

module.exports = Destination;
