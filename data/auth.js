module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) return next();

    req.flash("alert alert-danger", "You Need to Login ");
    res.redirect("/user/login");
  },
};
