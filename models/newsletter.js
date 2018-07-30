module.exports = (model) => {
  let newsletter = {
    create () {
      return model.create({
        _id: null,
        name: null,
        type: 'newsletter'
      })
    }
  }
  return newsletter
}
