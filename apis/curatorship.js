const api = require('express').Router();
module.exports = function (dbHandler, model) {
  const dialogModel = require('../models/dialog')(model);
  api.get('/dialogs', (req, res) => {
    let query = req.query.type;
    switch (query) {
      case 'finished':
        dbHandler.view('sources', 'getFinishedDialogs', (err, body) => {
          if (!err) {
            let result = body.rows.map(item => {
              return item.value
            })
            res.json(result)
          } else {
            res.status(500).json(err)
          }
        })
        break;
      case 'pending':
        dbHandler.view('sources', 'getPendingDialogs', (err, body) => {
          if (!err) {
            let result = body.rows.map(item => {
              return item.value
            })
            res.json(result)
          } else {
            res.status(500).json(err)
          }
        })
        break;
      default:
        dbHandler.view('sources', 'getUnseenDialogs', (err, body) => {
          if (!err) {
            let result = body.rows.map(item => {
              return item.value
            })
            res.json(result)
          } else {
            res.status(500).json(err)
          }
        })
        break;
    }
  })
  api.post('/update', (req, res) => {
    if (req.body.dialog) {
      model.findOneByID(req.body.dialog._id, (error, result) => {
        if (error) {
          res.status(500).send(error)
        } else {
          result.due_date = req.body.dialog.due_date
          if (req.body.dialog.solved_date) {
            result.solved_date = req.body.dialog.solved_date
          }
          if (!req.body.dialog.status) {
            result.solved_date = 'pending'
          }
          result.responsible = req.body.dialog.responsible
          result.status = req.body.dialog.status
          result.save(error => {
            if (error) {
              res.status(500).send(error)
            } else {
              res.send('Atualizado com sucesso')
            }
          })
        }
      })
    }
  })
  return api
}
