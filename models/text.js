module.exports = (model) => {
  let text = model.create({
    _id: null,
    title: null,
    text: null,
    tags: [],
    views: 0,
    likes: 0,
    unlikes: 0,
    type: 'text'
  })
  return text
}
