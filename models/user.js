module.exports = (model) => {
  let influencer = model.create({
    _id: null,
    medias: {
      twitter: null
    },
    like: [],
    dislike: [],
    type: 'profile'
  })
  return influencer
}
