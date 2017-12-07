const express = require('express');
const utils = require('../utils/promiseHandler');
const youtube = require('./youtube');
module.exports = function (appEnv, dbHandler, googleAPIKey) {
  const api = express.Router();
  const ConversationV1 = require('watson-developer-cloud/conversation/v1');
  let conversationCredentials = appEnv.services['conversation'][0].credentials
  let conversation = new ConversationV1({
    username: conversationCredentials.username,
    password: conversationCredentials.password,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });
  let workspace_id = '4757feda-62f4-4e59-8c50-c1f42a05926c';
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

  api.get('/message', (req, res) => {
    let _text = req.query.text;
    let _context = JSON.parse(req.query.context);
    conversation.message({
      context: _context,
      input: {
        text: _text,
      },
      workspace_id: workspace_id
    }, function (err, response) {
      if (err) {
        console.error(err);
      } else {
        // Get the context and help with profile
        // console.log(response.intents)
        // console.log(response.output)
        if (response.context.gettingProfile) {
          switch (response.context.gettingProfile) {
            case 'started':
              req.session.newProfile = {
                _id: new Date().getTime().toString(),
                _status: response.context.gettingProfile
              }
              console.log('Starting to get profile')
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
                      res.json(response)
                    })
                  }
                })
              } else {
                res.json(response)
              }
              break;
            case 'question':
              watson.translate(response.input.text).then(translation => {
                watson.analyze(translation).then(analysis => {
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
        } else {
          if (response.context.video_query) {
            dbHandler.view('sources', 'getYoutubeSource', (err, body) => {
              console.log('Youtube source from DB');
              if (!err) {
                let channels = body.rows[0].value;
                let videoQueue = response.context.video_query.map(category => {
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
                  res.json(response)
                })
              }
            })
          } else {
            res.json(response)
          }
        }
      }
    });
  })

  return api;
}
