const express = require('express');
const utils = require('../utils/promiseHandler');
const youtube = require('./youtube');
const axios = require('axios');
module.exports = function (appEnv, dbHandler, googleAPIKey, model) {
  const api = express.Router();
  const ConversationV1 = require('watson-developer-cloud/conversation/v1');
  let conversationCredentials = appEnv.services['conversation'][0].credentials
  let conversation = new ConversationV1({
    username: conversationCredentials.username,
    password: conversationCredentials.password,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });
  // let workspace_id = '4757feda-62f4-4e59-8c50-c1f42a05926c';
  let workspace_id = '6468a1fc-e783-4280-bbd1-8ca4f0839791';
  const watson = require('./watson')(appEnv);
  const youtubeInstance = new youtube.Youtube(googleAPIKey, dbHandler);
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
      } else {
        res.json(response)
      }
    });
  })

  let getOppty = function (location, conversationObj) {
    return new Promise((resolve, reject) => {
      let _address = location || ""
      _address = _address.replace('Brazil','')
      _address = _address.replace('Brasil','')
      axios.get('https://api.atados.com.br/search/projects', {
        headers: {'X-ovp-channel': 'default'},
        params: {
          cause: conversationObj._context.causes.map(item => item.id).join(', '),
          skill: conversationObj._context.skills.map(item => item.id).join(', '),
          address: {
            address_components:[{types:["administrative_area_level_1"],long_name:_address}]
          }
        }
      }).then(res => {
        console.log(res)
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
        res.status(500).json(err)
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
                      console.log(videos)
                      let sucess = videos.filter(item => item.status === 'resolved');
                      let filtered = sucess.map(videoList => {
                        videoList.v = videoList.v.filter(item => item.status === 'resolved');
                        return videoList.v.map(video => {
                          return video.v
                        })
                      });
                      response.context.video = [].concat.apply([], filtered);
                      response.context.user = req.session.newProfile;
                      req.session.newProfile.analysis = false
                      res.json(response)
                    })
                  }
                })
              } else if (response.context.search_oppty) {
                console.log('Oppty')
                getOppty(response.context.userLocation, conversationObj).then(oppty => {
                  response.context.opportunities = oppty
                  res.json(response)
                }).catch(err => {
                  console.log(err)
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
        } else if (response.context.search_oppty) {
          console.log('Oppty')
          getOppty(response.context.userLocation, conversationObj).then(oppty => {
            response.context.opportunities = oppty
            res.json(response)
          }).catch(err => {
            console.log(err)
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
    let conversationInput = {
      _text : req.query.text,
      _context : JSON.parse(req.query.context),
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
            console.log(videos)
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
  })

  return api;
}
