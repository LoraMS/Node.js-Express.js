module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  },
  isInRole: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      // res.locals.isAdmin = true;
      return next();
    } else {
      return res.redirect('/login');
    }
  },
};