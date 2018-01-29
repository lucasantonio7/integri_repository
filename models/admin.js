module.exports = (model) => {
  let influencer = model.create({
    _id: null,
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
    type: 'admin'
  })
  return influencer
}
