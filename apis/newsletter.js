const api = require('express').Router();
module.exports = function (model, dbHandler) {
  const newsletterModel = require('../models/newsletter')(model)
  api.post('/subscribe', (req, res) => {
    let email = req.body.email
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      model.findOneByID(email, (err, result) => {
        if (!err) {
          res.status(403).json(false)
        } else {
          if (err.statusCode === 404) {
            let newNL = newsletterModel.create()
            newNL._id = email
            newNL.save(err => {
              if (!err) {
                res.json(true)
              } else {
                res.status(400).json(err)
              }
            })
          }
        }
      })
    } else {
      res.status(412).json(false)
    }
  })
  api.get('/subscriptions', (req, res) => {
    dbHandler.view('newsletter', 'getAllSubscriptions', (err, body) => {
      if (!err) {
        res.json(body.rows)
      } else {
        res.status(err.statusCode).json(err)
      }
    })
  })
  return api
}
