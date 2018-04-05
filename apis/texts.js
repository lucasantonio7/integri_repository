const api = require('express').Router();
module.exports = function (model, textModel, dbHandler, env) {
  const textHandler = require('../utils/textHandler')(model, textModel, dbHandler, env);
  api.get('/content', (req, res) => {
    dbHandler.view('sources', 'getClassificationTags', (err, body) => {
      if (!err) {
        let classificationTags = body.rows[0].value
        dbHandler.view('sources', 'getTexts', (err, body) => {
          if (!err) {
            let rst = body.rows;
            res.json(rst.map(txt => {
              return txt.value
            }))
          } else {
            res.status(500).json(err)
          }
        })
      } else {
        res.status(500).json(err)
      }
    })
  });
  api.get('/txt/:id', (req, res) => {
    let id = req.params.id
    model.findOneByID(id, (err, result) => {
      if (!err) {
        res.json(result)
      } else {
        res.status(500).send(err)
      }
    })
  })
  api.post('/addview', (req, res) => {
    let id = req.body.id;
    model.findOneByID(id, (err, result) => {
      if (!err) {
        result.views++
        result.save((err) => {
          if (err) {
            res.status(500).send(err)
          } else {
            res.json(true)
          }
        })
      }
    })
  })
  return api;
}
