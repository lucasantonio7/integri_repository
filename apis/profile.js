const router = require('express').Router();
const bcrypt = require('bcryptjs');
const youtube = require('./youtube');
const utils = require('../utils/promiseHandler');

module.exports = function (model, userModel, youtubeAPIKey, dbHandler) {
  const youtubeInstance = new youtube.Youtube(youtubeAPIKey, dbHandler);
  const profileHandler = require('../utils/profileHandler')(model, userModel, dbHandler)
  router.post('/save', (req, res) => {
    let user = {
      _id: req.body.id,
      pwd: req.body.pwd,
      name: req.body.name,
      email: req.body.email,
      like: req.body.like,
      skills: req.body.skills,
      causes: req.body.causes,
      location: req.body.location
    }
    dbHandler.view('profiles', 'getUsers', {
      keys: [user.email]
    }, (err, body) => {
      console.log(body)
      if (body.rows.length > 0) {
        res.status(403).json(err)
      } else {
        let salt = bcrypt.genSaltSync(10);
        let hashPwd = bcrypt.hashSync(user.pwd, salt)
        let newUser = userModel;
        newUser._id = user._id;
        newUser.name = user.name;
        newUser.like = user.like;
        newUser.skills = user.skills;
        newUser.causes = user.causes;
        newUser.created_at = Date.now();
        newUser.last_change = Date.now();
        newUser.last_login = Date.now();
        newUser.medias = {
          integri: {
            email: user.email,
            pwd: hashPwd
          }
        }
        newUser.location = user.location
        newUser.save((err) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.json('User successfully saved')
          }
        })
      }
    })
  });

  router.post('/update', (req, res) => {
    console.log(req.body)
    profileHandler.updateProfile(req.body)
  })

  router.get('/videos', (req, res) => {
    let analysis = req.query.cat;
    if (analysis) {
      dbHandler.view('sources', 'getYoutubeSource', (err, body) => {
        console.log('Youtube source from DB');
        if (!err) {
          let channels = body.rows[0].value;
          let videoQueue = analysis.map(category => {
            console.log('Category ', category)
            return new Promise((resolve, reject) => {
              youtubeInstance.videosSources(category, channels).then(resp => {
                console.log('Success Videos:')
                console.log(resp)
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
            if (sucess.length > 0) {
              console.log(sucess)
              let filtered = sucess.map(videoList => {
                videoList.v = videoList.v.filter(item => item.status === 'resolved');
                return videoList.v.map(video => {
                  return video.v
                })
              });
              let dataResponse = [].concat.apply([], filtered);
              console.log(dataResponse)
              res.json(dataResponse)
            } else {
              res.status(404).json('Any video spotted')
            }
          }).catch(err => {
            console.log(err)
            res.status(500).json('Any video spotted')
          })
        } else {
          res.status(404).json('Unable to get channels')
        }
      })
    }
  })

  return router;
}
