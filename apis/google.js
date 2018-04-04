// All things related to Google like Youtube API goes here
const google = require('googleapis');
const express = require('express');
const utils = require('../utils/promiseHandler');
module.exports = function (apiKey, dbHandler, model) {
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
    },
    processQuery(queryGroup) {
      return new Promise((resolve, reject) => {
        youtube.videos.list({
          part: 'snippet,contentDetails,statistics',
          id: queryGroup.reduce((prev, next) => {
            if (prev.id) {
              return prev.id + "," + next.id
            } else {
              return prev + "," + next.id
            }
          })
        }, (err, resp) => {
          if (err) {
            reject(err);
          } else {
            // Max 50 videos
            let relevantContent = resp.items.map(item => {
              let elementIndexQG = queryGroup.findIndex((elem, index) => {
                if (elem.id == item.id) {
                  return true
                } else {
                  return false
                }
              })
              return {
                id: item.id,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.standard || item.snippet.thumbnails.default,
                views: item.statistics.viewCount,
                tags: elementIndexQG > -1 ? queryGroup[elementIndexQG].tags : ['']
              }
            })

            resolve(relevantContent)
          }
        })
      })
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
          } else {
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
          }
        });
      }
    })
  })

  api.get('/videocontent', (req, res) => {
    let tags = req.params.tags;
    dbHandler.view('sources', 'getVideoContent_c', (err, body) => {
      if (!err) {
        let videos = body.rows[0].value;
        let queryGroups = []
        let hasCache = false
        let stored_data = []
        let videos_cache = null
        // First of all verify if there is a cache from videos
        dbHandler.view('sources', 'getContentVideoCache', (err, body) => {
          if (!err) {
            try {
              videos_cache = body.rows[0].value;
              if (Object.keys(videos_cache.videos).length > 0 && videos_cache.videos.constructor === Object) {
                // Remove all already cached videos
                videos.videos_sources = videos.videos_sources.filter(video => {
                  if (videos_cache.videos[video.id]) {
                    stored_data.push(videos_cache.videos[video.id])
                    return false
                  } else {
                    return video
                  }
                })
                hasCache = true
              }
              // Verify if there is any video that wasn't on cache
              if (videos.videos_sources.length > 0) {
                console.log('Teimoso')
                videos.videos_sources.map(video => {
                  if (queryGroups.length < 1) {
                    queryGroups.push([video])
                  } else if (queryGroups[queryGroups.length - 1].length < 50) {
                    queryGroups[queryGroups.length - 1].push(video)
                  } else {
                    queryGroups.push([video])
                  }
                })
                let queue = queryGroups.map(query => {
                  return helper.processQuery(query)
                })
                Promise.all(queue).then(result => {
                  let joinedResult = [].concat.apply([], result)
                  if (stored_data.length > 0) {
                    joinedResult = joinedResult.concat.apply([], stored_data)
                  }
                  if (!hasCache) {
                    if (videos_cache) {
                      model.findOneByID(videos_cache._id, (error, result) => {
                        if (!error) {
                          joinedResult.forEach(vid => {
                            result.videos[vid.id] = vid
                          })
                          result.save(err => {
                            console.log(err)
                          })
                        }
                      })
                    }
                  }
                  res.json(joinedResult)
                }).catch(err => {
                  console.log(err)
                  res.status(500).json(err)
                })
              } else if (stored_data.length > 0) {
                console.log('Fully charged from cache')
                res.json(stored_data)
              } else {
                res.status(500).json('Falha ao retornar videos')
              }
            } catch (ex) {
              res.status(500).json(ex)
            }
          } else {
            res.status(500).json(err)
          }
        })
      } else {
        res.status(500).json(err)
      }
    })
  })

  api.get('/video/:id', (req, res) => {
    let videoId = req.params.id;
    youtube.videos.list({
      part: 'snippet',
      id: videoId
    }, (err, videoData) => {
      console.log(err)
      if (err) {
        res.status(500).json(err)
      } else {
        if (videoData.items.length > 0) {
          let video = videoData.items.pop()
          res.json({
            id: video.id,
            title: video.snippet.title,
            channel: video.snippet.channelTitle,
            thumbnail: video.snippet.thumbnails.standard || video.snippet.thumbnails.default
          })
        } else {
          res.status(500)
        }
      }
    })
  })

  return api;
}
