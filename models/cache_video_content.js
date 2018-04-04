module.exports = (model) => {
  let video_content_cache = model.create({
    _id: null,
    videos : {},
    type: 'video_content_cache'
  })
  return video_content_cache
}
