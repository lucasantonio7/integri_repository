module.exports = (model) => {
  let influencer = model.create({
    _id: null,
    medias: {
      twitter: null,
      facebook:null,
      integri: {
        email: '',
        pwd: ''
      }
    },
    like: [],
    skills: [],
    causes: [],
    location: '',
    name: '',
    profile_image: null,
    created_at: null,
    last_change: null,
    last_login: null,
    unsuccessfull_attempts: null,
    blocked: {
      permanently: false,
      block_time: null,
    },
    role: null,
    access: [],
    type: 'profile'
  })
  return influencer
}
