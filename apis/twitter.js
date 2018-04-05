const express = require('express');
let jsonWT = require('jsonwebtoken');
module.exports = function (passport, cookieParser, env) {
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
    res.redirect('/')
  });
  // Will retrieve user's data
  api.get('/user', (req, res) => {
    console.log(req.session.denied)
    var cookie = null;
    if (req.cookies) {
      cookie = cookieParser.JSONCookies(req.cookies);
    }
    if (req.user) {
      res.json({
        login: true,
        user: req.user,
        denied: false
      })
    } else if (cookie && cookie['integri']) {
      jsonWT.verify(cookie['integri'], env.global_secret, (err, decoded) => {
        if (!err) {
          res.json({
            login: true,
            user: decoded,
            denied: false
          })
        } else {
          res.json({
            login: false,
            denied: req.session.denied
          })
        }
      })
    } else {
      res.json({
        login: false,
        denied: req.session.denied
      })
    }
  });

  api.get('/logout', (req, res) => {
    let cookie = cookieParser.JSONCookies(req.cookies);
    if (cookie && cookie['integri']) {
      res.clearCookie('integri');
    } else {
      req.logout();
    }
    res.redirect('/');
  })
  return api;
}
