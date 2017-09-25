// All things related to Google like Youtube API goes here
const google = require('googleapis');
const express = require('express');

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

module.exports = function (apiKey, dbHandler) {
  // Start a instance of youtube API
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  let helper = {
    // Search in some channels by the content extracted from
    videosSources(query) {
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
  }

  let api = express.Router();
  api.get('/sortvideos', (req, res) => {
    let query = req.params.query;
    helper.videosSources(query).then(resp => {}).catch(err => {})
  })

  api.get('/trends', (req, res) => {
    // Get uploads playlist from a given channel or set of channels
    console.log('Trends')
    dbHandler.view('sources', 'getYoutubeSource', (err, body) => {
      if (!err) {
        let channels = body.rows[0].value;
        channels = channels.map(ch => {
          return ch.id
        });
        channels = channels.join(', ');
        youtube.channels.list({
          part: 'contentDetails',
          id: channels,
        }, function (err, channelDetails) {
          if (err) {
            res.status(500).send(err);
          }
          if (channelDetails.pageInfo.totalResults > 0) {
            // For each list get the videos
            let videosPromises = channelDetails.items.map(item => {
              return new Promise((resolve,reject) => {
                youtube.playlistItems.list({
                  part: 'snippet',
                  playlistId: item.contentDetails.relatedPlaylists.uploads,
                  maxResults: 3
                }, function (err, playlist) {
                  // Loop through videos list
                  if (err) {
                    try {
                      res.status(err.response.status).send(err)
                    } catch (e) {
                      res.status(404).send(err)
                    }
                  } else {
                    let videosList = []
                    playlist.items.forEach(function (video) {
                      videosList.push(video.snippet.resourceId.videoId)
                    });
                    resolve(videosList);
                  }
                });
              })
            });
            Promise.all(videosPromises.map(reflect)).then(videos => {
              let sucess = videos.filter(item => item.status === 'resolved');
              let response = sucess.map(video => {
                return video.v
              })
              response = [].concat.apply([],response);
              res.json(response);
            }).catch(err => {
              res.status(500).send(err);
            })
          } else {
            res.status(404).send('Resource not found');
          }
        });
      }
    })
  })

  return api;
}
