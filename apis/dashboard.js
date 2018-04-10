const api = require('express').Router();
let jsonWT = require('jsonwebtoken');
module.exports = function (dbHandler, model, cookieParser, env) {
  const dialogModel = require('../models/dialog')(model);
  api.get('/features', (req, res) => {
    if (req.cookies) {
      let cookie = cookieParser.JSONCookies(req.cookies);
      if (cookie && cookie['integri']) {
        jsonWT.verify(cookie['integri'], env.global_secret, (err, decoded) => {
          if (!err) {
            if (decoded.role === 'admin') {
              dbHandler.view('sources', 'getSystemFeatures', (err, body) => {
                if(!err) {
                  res.json(body.rows[0].value.features)
                } else {
                  res.status(500).json(err)
                }
              })
            } else if (decoded.role === 'curator') {
              // 
            } else {
              res.status(403).json(false)
            }
          } else {
            res.status(500).json(err)
          }
        })
      } else {
        res.status(403).json(false)
      }
    } else {
      res.status(403).json(false)
    }
  })
  return api
}
