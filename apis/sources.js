const api = require('express').Router();
const path = require('path');
module.exports = function (dbHandler) {
  api.get('/privacy', (req, res) => {
    dbHandler.view('sources', 'getPrivacyPolicy', (err, body) => {
      if (!err) {
        res.json(body.rows[0].value)
      } else {
        res.status(500).json(err)
      }
    })
  });

  api.get('/usage', (req, res) => {
    dbHandler.view('sources', 'getUsageTerms', (err, body) => {
      if (!err) {
        res.json(body.rows[0].value)
      } else {
        res.status(500).json(err)
      }
    })
  });

  api.get('/places', (req, res) => {
    try {
      let places = require(path.resolve('./src/assets/json/estados-cidades.json'));
      res.json(places);
    } catch (ex) {
      res.status(500).json({
        error: "Não foi possivel retornar os estados"
      })
    }
  });

  api.get('/classificationtags', (req, res) => {
    dbHandler.view('sources', 'getClassificationTags', (err, body) => {
      if (!err) {
        res.json(body.rows[0].value)
      } else {
        res.status(500).json(err)
      }
    })
  })
  return api;
}
