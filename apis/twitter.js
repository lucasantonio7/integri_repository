const express = require('express');
module.exports = function (passport) {
  let api = express.Router();
  api.get('/login', passport.authenticate('twitter'));
  // After user's authorization
  api.get('/return', passport.authenticate('twitter', {
    failureRedirect: '/api/twitter/denied',
  }), (req, res) => {
    console.log(req.token)
    res.redirect('/')
  });
  api.get('/denied', (req, res) => {
    req.session.denied = true;
    console.log('Access was denied by the user')
    res.redirect('/')
  });
  // Will retrieve user's data
  api.get('/user', (req, res) => {
    console.log(req.session.denied)
    if (req.user) {
      res.json({
        login: true,
        user: req.user,
        denied: false
      })
    } else {
      res.json({
        login: false,
        denied: req.session.denied
      })
    }
  });

  api.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
  return api;
}
