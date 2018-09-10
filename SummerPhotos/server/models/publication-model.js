class Publication {
    static isValid(model) {
        return typeof model !== 'undefined' &&
            typeof model.title === 'string' &&
            typeof model.publisher === 'string' &&
            typeof model.publisherinfo === 'string' &&
            typeof model.destination === 'string' &&
            typeof model.text1 === 'string' &&
            typeof model.text2 === 'string' &&
            typeof model.text3 === 'string';
    }

    static toViewModel(model) {
        const viewModel = new Publication();

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

module.exports = Publication;
