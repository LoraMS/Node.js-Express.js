module.exports = function(data) {
    return {
        getHomePage(req, res) {
            return res.render('home/home');
        },
        getContactForm(req, res) {
            return res.render('forms/contact-form');
        },
        postContactForm(req, res) {
            return res.render('forms/contact-form');
        },
    };
};
