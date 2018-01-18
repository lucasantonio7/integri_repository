module.exports = (model) => {
  let dialog = model.create({
    _id: null,
    messages: [],
    captured: null,
    due_date: null,
    solved_date: null,
    responsible: '',
    status: null,
    type: 'dialog'
  })
  return dialog
}
