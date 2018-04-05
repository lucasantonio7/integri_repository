module.exports = (model) => {
  let dialog = model.create({
    _id: null,
    messages: [],
    captured: null,
    due_date: null,
    solved_date: null,
    responsible: {
      name: null,
      email: null
    },
    status: null,
    type: 'dialog'
  })
  return dialog
}
