// All things related to Google like Youtube API goes here
const google = require('googleapis');
const express = require('express');
const utils = require('../utils/promiseHandler');
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
              return new Promise((resolve, reject) => {
                youtube.search.list({
                  part: 'snippet',
                  channelId: channel.id,
                  q: query
                }, (err, videos) => {
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
            Promise.all(channelsPromises.map(utils.reflect)).then(videos => {
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
              return new Promise((resolve, reject) => {
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
                      videosList.push({
                        id: video.snippet.resourceId.videoId,
                        title: video.snippet.title,
                        channel: video.snippet.channelTitle,
                        thumbnail: video.snippet.thumbnails.standard || video.snippet.thumbnails.default
                      })
                    });
                    resolve(videosList);
                  }
                });
              })
            });
            Promise.all(videosPromises.map(utils.reflect)).then(videos => {
              let sucess = videos.filter(item => item.status === 'resolved');
              let response = sucess.map(video => {
                return video.v
              })
              response = [].concat.apply([], response);
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

  api.get('/videocontent', (req, res) => {
    let tags = req.params.tags;
    dbHandler.view('sources', 'getVideoContent', (err, body) => {
      if (!err) {
        let videos = body.rows[0].value;
        let videosIDs = videos.videos_sources.reduce((prev, next) => {
          if (prev.id) {
            return prev.id + "," + next.id
          } else {
            return prev + "," + next.id
          }
        });
        console.log(videosIDs)
        youtube.videos.list({
          part: 'snippet,contentDetails,statistics',
          id: videosIDs
        }, (err, resp) => {
          if (err) {
            console.log(err)
            res.status(500).json(err);
          } else {
            // resp.items.forEach(item => {
            //   // get video views and order by views
            // })
            // Max 50 videos
            let relevantContent = resp.items.map(item => {
              return {
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.standard,
                views: item.statistics.viewCount
              }
            })
            res.send(relevantContent)
          }
        })
      } else {
        res.status(500).json(err)
      }
    })
  })

  return api;
}
