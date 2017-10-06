module.exports = (model) => {
  let influencer = model.create({
    _id: null,
    medias: {
      twitter: null,
      integri: {
        email: '',
        pwd: ''
      }
    },
    like: [],
    // dislike: [],
    location: '',
    name: '',
    created_at: null,
    last_change: null,
    last_login: null,
    type: 'profile'
  })
  return influencer
}
