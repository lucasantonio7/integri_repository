const api = require('express').Router();
module.exports = function (dbHandler) {
  api.get('/privacy', (req,res) => {
    dbHandler.view('sources', 'getPrivacyPolicy', (err, body) => {
      if (!err) {
        res.json(body.rows[0].value)
      } else {
        res.status(500).json(err)
      }
    })
  });

  api.get('/usage', (req,res) => {
    dbHandler.view('sources', 'getUsageTerms', (err, body) => {
      if (!err) {
        res.json(body.rows[0].value)
      } else {
        res.status(500).json(err)
      }
    })
  });
  return api;
}