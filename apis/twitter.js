const express = require('express');
module.exports = function (passport) {
  let api = express.Router();
  api.get('/login', passport.authenticate('twitter'));
  // After user's authorization
  api.get('/return', passport.authenticate('twitter', {
    failureRedirect: '/',
  }), (req, res) => {
    res.redirect('/')
  });
  // Will retrieve user's data
  api.get('/user', (req, res) => {
    if (req.user) {
      res.json({
        login: true,
        user: req.user
      })
    } else {
      res.json({
        login: false
      })
    }
  });
  return api;
}
