// All things related to Google like Youtube API goes here
const google = require('googleapis');
const express = require('express');

module.exports = function (apiKey, dbHandler) {
  // Start a instance of youtube API
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  function reflect(promise) {
    return promise.then(function (v) {
        return {
          v: v,
          status: "resolved"
        }
      },
      function (e) {
        return {
          e: e,
          status: "rejected"
        }
      });
  }

  // Search in some channels by the content extracted from
  function videosSources(query) {
    return new Promise((resolve, reject) => {
      let channels = null;
      dbHandler.view('sources', 'getYoutubeSource', (err, body) => {
        console.log('Youtube source from DB');
        if (!err) {
          let channels = body.rows[0].value;
          let channelsPromises = channels.map(channel => {
            console.log(channel);
            return new Promise((resolve, reject) => {
              youtube.search.list({
                part: 'snippet',
                channelId: channel.id,
                q: query
              }, (err, videos) => {
                console.log(videos)
                if (!err) {
                  if (videos.pageInfo.totalResults > 0) {
                    videos.items.forEach(video => {
                      if (video.id.videoId) {
                        resolve(video.id.videoId)
                      } else {
                        reject({
                          message: 'This object is not a video'
                        })
                      }
                    })
                  } else {
                    reject({
                      message: 'This query has no results'
                    })
                  }
                } else {
                  reject(err)
                }
              })
            })
          })
          Promise.all(channelsPromises.map(reflect)).then(videos => {
            let sucess = videos.filter(item => item.status === 'resolved');
            resolve(sucess);
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(err)
        }
      })
    });
  }

  let api = express.Router();

  api.get('sortvideos', (req, res) => {
    let query = req.params.query;
    videosSources(query).then(resp => {

    }).catch(err => {
      
    })
  })

  return api;
}
