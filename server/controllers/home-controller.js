module.exports = function(data) {
    return {
        getHomePage(req, res) {
            return res.render('home/home');
        },
        getContactForm(req, res) {
            return res.render('forms/contact-form');
        },
        postContactForm(req, res) {
            req.flash('success', 'Your message was sent successfully!');
            return res.render('forms/contact-form');
        },
    };
};
