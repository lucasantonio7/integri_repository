module.exports = (model) => {
  let video_content_cache = model.create({
    _id: null,
    videos : {},
    last_update: null,
    type: 'video_content_cache'
  })
  return video_content_cache
}
