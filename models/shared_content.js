module.exports = (model) => {
  let shared_content = {
    create () {
      return model.create({
        _id: null,
        author : {},
        email: null,
        data: null,
        created: null,
        type: 'shared_content'
      })
    }
  }
  return shared_content
}
