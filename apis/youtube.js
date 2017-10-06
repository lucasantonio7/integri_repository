const google = require('googleapis');
const utils = require('../utils/promiseHandler');
class Youtube {
  constructor(apiKey, dbHandler) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
    this.dbHandler = dbHandler;
  }

  videosSources(query, channels) {
    return new Promise((resolve, reject) => {
      let channelsPromises = channels.map(channel => {
        return new Promise((resolve, reject) => {
          this.youtube.search.list({
            part: 'snippet',
            channelId: channel.id,
            q: query,
            type: 'video',
            videoEmbeddable: 'true',
            videoCaption: 'closedCaption',
            relevanceLanguage: 'pt'
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
    });
  }
}
module.exports = {
  Youtube
};
