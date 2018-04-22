const api = require('express').Router();
const moment = require('moment');
module.exports = function (model, dbHandler) {
  let shared = require('../models/shared_content')(model)
  api.get('/content', (req, res) => {
    dbHandler.view('external', 'getSharedContent', (err, body) => {
      if (!err) {
        res.json(body.rows.map(item => item.value))
      } else {
        res.status(500).json(err)
      }
    })
  })
  // Shared content from users to Integri
  api.post('/shared', (req, res) => {
    try {
      let content = req.body
      let params = {
        keys: [
          content.email
        ]
      }
      dbHandler.view('external', 'getAuthorsPosts', params, (err, body) => {
        if (!err) {
          let canSave = false
          let now = moment()
          if (body.rows.length > 0) {
            let timestamps = body.rows.map(row => {
              return row.value
            })
            if (now.diff(moment(Math.max(...timestamps)), 'minutes') >= 10){
              canSave = true
            }
          } else {
            canSave = true
          }
          if (canSave) {
            let new_shared = shared.create()
            new_shared.author = content.author
            new_shared.email = content.email
            new_shared.data = content.data
            new_shared.created = Date.now()
            new_shared.save(err => {
              if (!err) {
                res.json('Foi')
              } else {
                res.status(400).json(false)
              }
            })

          } else {
            res.status(403).json(false)
          }
        } else {
          res.status(500).json(err)
        }
      })
    } catch (ex) {
      res.status(500).json(ex)
    }
  })
  api.post('/viewd', (req, res) => {
    
  })
  api.delete('/delete', (req, res) => {

  })
  return api
}
