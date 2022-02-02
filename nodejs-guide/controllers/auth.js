const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   // const session.isLoggedIn =
   //    req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
   });
};

exports.postLogin = (req, res, next) => {
   User.findById('61f36494a9f4191d40c4fbab')
      .then((user) => {
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.session.save((err) => {
            console.log(err);
            res.redirect('/');
         }); // This is so we can be sure our session was created before our page loads
      })
      .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
   req.session.destroy((err) => {
      console.log(err);
      res.redirect('/');
   });
};
