const api = require('express').Router();
let jsonWT = require('jsonwebtoken');
module.exports = function (dbHandler, model, cookieParser, env) {
  const dialogModel = require('../models/dialog')(model);
  const textsModel = require('../models/text')(model);
  api.get('/features', (req, res) => {
    if (req.cookies) {
      let cookie = cookieParser.JSONCookies(req.cookies);
      if (cookie && cookie['integri']) {
        jsonWT.verify(cookie['integri'], env.global_secret, (err, decoded) => {
          if (!err) {
            if (decoded.role === 'admin') {
              dbHandler.view('sources', 'getSystemFeatures', (err, body) => {
                if (!err) {
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
  api.post('/content-video', (req, res) => {
    let video = req.body.video
    if (video) {
      dbHandler.view('sources', 'getVideoContent_c', (err, body) => {
        if (!err) {
          console.log(body.rows[0])
          let videos = body.rows[0].value;
          let updateIndex = videos.videos_sources.findIndex((vid) => {
            if (vid.id === video.id) {
              return true
            }
          })
          if (updateIndex > -1) {
            videos.videos_sources[updateIndex].id = video.id
            videos.videos_sources[updateIndex].tags = video.tags
          } else {
            videos.videos_sources.push(video)
          }
          let videosModel = model.create(videos)
          videosModel.save((err) => {
            if (!err) {
              dbHandler.view('sources', 'getContentVideoCache', (err, body) => {
                if (!err) {
                  let videos_cache = body.rows[0].value;
                  if (videos_cache.videos) {
                    if (videos_cache.videos[video.id]) {
                      videos_cache.videos[video.id].id = video.id
                      videos_cache.videos[video.id].tags = video.tags
                      let videosCacheModel = model.create(videos_cache)
                      videosCacheModel.save((err) => {
                        if (!err) {
                          res.json(true)
                        } else {
                          res.status(500).json(err)
                        }
                      })
                    } else {
                      // There is no cache
                      res.json(true)
                    }
                  } else {
                    // There is no cache
                    res.json(true)
                  }
                }
              })
            } else {
              res.status(500).json(err)
            }
          })
        }
      })
    }
  })
  api.post('/content-text', (req, res) => {
    let text = req.body.text
    if (text) {
      if (text._id) {
        model.findOneByID(text._id, (error, result) => {
          result.title = text.title;
          result.text = text.text;
          result.tags = text.tags;
          result.source = text.source
          result.save((err) => {
            if (!err) {
              res.json(true)
            } else {
              res.status(500).json(err)
            }
          })
        })
      } else {
        let newText = textsModel;
        newText.title = text.title;
        newText.text = text.text;
        newText.tags = text.tags
        newText.save((err) => {
          if (!err) {
            res.json(true)
          } else {
            res.status(500).json(err)
          }
        })
      }
    }
  })
  api.delete('/remove-text/:id', (req, res) => {
    console.log()
    model.findOneByID(req.params.id, (error, result) => {
      if (!error) {
        result.delete((err) => {
          if (!err) {
            res.json(true)
          } else {
            res.status(500).json(err)
          }
        })
      }
    })
  })
  api.delete('/remove-video/:id', (req, res) => {
    dbHandler.view('sources', 'getVideoContent_c', (err, body) => {
      if (!err) {
        console.log(body.rows[0])
        let videos = body.rows[0].value;
        let removeIndex = videos.videos_sources.findIndex((vid) => {
          if (vid.id === req.params.id) {
            return true
          }
        })
        if (removeIndex > -1) {
          videos.videos_sources.splice(removeIndex, 1)
          let videosModel = model.create(videos)
          videosModel.save((err) => {
            if (!err) {
              // Also delete from cache
              dbHandler.view('sources', 'getContentVideoCache', (err, body) => {
                if (!err) {
                  let videos_cache = body.rows[0].value;
                  if (videos_cache.videos) {
                    if (videos_cache.videos[req.params.id]) {
                      delete videos_cache.videos[req.params.id]
                      let videosCacheModel = model.create(videos_cache)
                      videosCacheModel.save((err) => {
                        if (!err) {
                          res.json(true)
                        } else {
                          res.status(500).json(err)
                        }
                      })
                    } else {
                      // There is no cache
                      res.json(true)
                    }
                  } else {
                    // There is no cache
                    res.json(true)
                  }
                }
              })
            } else {
              res.status(500).json(err)
            }
          })
        } else {
          res.status(500).json(false)
        }
      }
    })
  })
  return api
}
