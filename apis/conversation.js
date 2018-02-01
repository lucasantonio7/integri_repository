const express = require('express');
const utils = require('../utils/promiseHandler');
const youtube = require('./youtube');
const axios = require('axios');
module.exports = function (appEnv, dbHandler, envVars, model) {
  const dialogModel = require('../models/dialog')(model);
  const api = express.Router();
  const ConversationV1 = require('watson-developer-cloud/conversation/v1');
  let conversationCredentials = appEnv.services['conversation'][0].credentials
  let conversation = new ConversationV1({
    username: conversationCredentials.username,
    password: conversationCredentials.password,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });
  let workspace_id = envVars.workspace_id;
  const watson = require('./watson')(appEnv);
  const youtubeInstance = new youtube.Youtube(envVars.youtubeAPIKey, dbHandler);
  api.get('/init', (req, res) => {
    let text = req.params.text || '';
    conversation.message({
      input: {
        text: text
      },
      workspace_id: workspace_id
    }, function (err, response) {
      if (err) {
        console.error(err);
        console.log('error:', err);
        res.json(err)
      } else {
        res.json(response)
      }
    });
  })

  let getOppty = function (location, conversationObj) {
    return new Promise((resolve, reject) => {
      let _address = location || ""
      _address = _address.replace('Brazil', '')
      _address = _address.replace('Brasil', '')
      console.log(_address)
      let url = _address.includes('Rio Grande do Sul') ? 'https://api.beta.atados.com.br/search/projects' : 'https://v2.api.atados.com.br/search/projects'
      let headerValue = _address.includes('Rio Grande do Sul') ? 'pv' : 'default'
      console.log(url)
      console.log(headerValue)
      axios.get(url, {
        headers: {
          'X-ovp-channel': headerValue
        },
        params: {
          cause: conversationObj._context.causes.map(item => item.id).join(', '),
          skill: conversationObj._context.skills.map(item => item.id).join(', '),
          address: {
            address_components: [{
              types: ["administrative_area_level_1"],
              long_name: _address
            }]
          }
        }
      }).then(res => {
        if (res.data.count) {
          resolve(res.data.results)
        } else {
          resolve(null)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  let processConversationMessage = function (res, req, conversationObj) {
    conversation.message({
      context: conversationObj._context,
      input: {
        text: conversationObj._text,
      },  
      workspace_id: workspace_id
    }, function (err, response) {
      if (err) {
        console.error(err);
        console.log("CONVERSATION ERROR! ", err);
        res.status(500).send(err);
      } else {
        // Get the context and help with profile
        if (response.context.gettingProfile && !response.context.skipNLU) {
          switch (response.context.gettingProfile) {
            case 'started':
              console.log('Starting to get profile')
              req.session.newProfile = {
                _id: new Date().getTime().toString(),
                _status: response.context.gettingProfile
              }
              res.json(response)
              break;
            case 'finished':
              console.log('All questions were made')
              req.session.newProfile._status = 'finished';
              if (req.session.newProfile.analysis) {
                dbHandler.view('sources', 'getYoutubeSource', (err, body) => {
                  console.log('Youtube source from DB');
                  if (!err) {
                    let channels = body.rows[0].value;
                    let videoQueue = req.session.newProfile.analysis.map(category => {
                      return new Promise((resolve, reject) => {
                        youtubeInstance.videosSources(category, channels).then(resp => {
                          resolve(resp)
                        }).catch(err => {
                          reject(err)
                        })
                      })
                    })
                    Promise.all(videoQueue.map(utils.reflect)).then(videos => {
                      let sucess = videos.filter(item => item.status === 'resolved');
                      let filtered = sucess.map(videoList => {
                        videoList.v = videoList.v.filter(item => item.status === 'resolved');
                        return videoList.v.map(video => {
                          return video.v
                        })
                      });
                      response.context.video = [].concat.apply([], filtered);
                      response.context.user = req.session.newProfile;
                      req.session.newProfile = false
                      res.json(response)
                    })
                  }
                })
              } else if (response.context.search_oppty) {
                console.log('Oppty')
                getOppty(response.context.userLocation, conversationObj).then(oppty => {
                  response.context.opportunities = oppty
                  delete response.context.search_oppty
                  delete response.context.gettingProfile
                  if (!oppty) {
                    delete response.context.display
                  }
                  conversationObj._context = response.context
                  processConversationMessage(res, req, conversationObj)
                }).catch(err => {
                  if (err.response) {
                    console.log(err.response.data)
                    console.log(err.response.status)
                    console.log(err.response.headers)
                  } else if (err.request) {
                    console.log(err.request)
                  } else {
                    console.log('err', err.message)
                  }
                })
              } else {
                res.json(response)
              }
              break;
            case 'question':
              console.log(response.input.text)
              watson.translate(response.input.text).then(translation => {
                watson.analyze(translation).then(analysis => {
                  if (!req.session.newProfile && !req.user && !(cookie && cookie['integri'])) {
                    req.session.newProfile = {
                      _id: new Date().getTime().toString(),
                      _status: response.context.gettingProfile
                    }
                  }
                  if (!req.session.newProfile.analysis) {
                    req.session.newProfile.analysis = []
                  }
                  analysis.categories.forEach(cat => {
                    let query = cat.label.split('/');
                    query = query.forEach(val => {
                      if (val) {
                        req.session.newProfile.analysis.push(val)
                        console.log(req.session.newProfile)
                      }
                    })
                  })
                  res.json(response)
                }).catch(err => {
                  res.json(response)
                })
              }).catch(err => {
                console.log(err)
              })
              break;
          }
        } else if (response.context.search_oppty && !response.context.opportunities) {
          getOppty(response.context.userLocation, conversationObj).then(oppty => {
            response.context.opportunities = oppty
            delete response.context.search_oppty
            if (!oppty) {
              delete response.context.display
            }
            conversationObj._context = response.context
            processConversationMessage(res, req, conversationObj)
          }).catch(err => {
            if (err.response) {
              console.log(err.response.data)
              console.log(err.response.status)
              console.log(err.response.headers)
            } else if (err.request) {
              console.log(err.request)
            } else {
              console.log('err', err.message)
            }
            response.context.opportunities = null
            response.context.search_oppty = null
            conversationObj._context = response.context
            processConversationMessage(res, req, conversationObj)
          })
        } else {
          if (conversationObj._videosList) {
            response.context.video = conversationObj._videosList
          }
          res.json(response)
        }
      }
    });
  }

  api.get('/message', (req, res) => {
    try {
      let conversationInput = {
        _text: req.query.text,
        _context: JSON.parse(req.query.context),
        _videosList: null
      }
      let videosList;
      if (conversationInput._context.video_query) {
        dbHandler.view('sources', 'getYoutubeSource', (err, body) => {
          console.log('Youtube source from DB');
          if (!err) {
            let channels = body.rows[0].value;
            let videoQueue = conversationInput._context.video_query.map(category => {
              console.log('Category ', category)
              return new Promise((resolve, reject) => {
                youtubeInstance.videosSources(category, channels).then(resp => {
                  console.log('Success Videos:')
                  resolve(resp)
                }).catch(err => {
                  console.log("Error videos")
                  reject(err)
                })
              })
            })
            Promise.all(videoQueue.map(utils.reflect)).then(videos => {
              let sucess = videos.filter(item => item.status === 'resolved');
              let filtered = sucess.map(videoList => {
                videoList.v = videoList.v.filter(item => item.status === 'resolved');
                return videoList.v.map(video => {
                  return video.v
                })
              });
              if (filtered.length) {
                delete conversationInput._context.video_query
                conversationInput._videosList = [].concat.apply([], filtered);
                processConversationMessage(res, req, conversationInput)
              } else {
                conversationInput._text = 'No video'
                delete conversationInput._context.video_query
                processConversationMessage(res, req, conversationInput)
              }
            })
          }
        })
      } else {
        processConversationMessage(res, req, conversationInput)
      }
    } catch (ex) {
      res.send(ex)
    }
  })

  api.post('/savedialog', (req, res) => {
    if (req.body.data) {
      let newDialog = dialogModel;
      newDialog._id = req.body.data._id.toString();
      newDialog.captured = req.body.data.captured
      newDialog.messages = req.body.data.messages
      newDialog.save(err => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.json("Dialog successfully registered")
        }
      })
    } else {
      res.status(400).send("Any dialog provided")
    }
  })

  return api;
}
