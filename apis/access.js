let router = require('express').Router();

module.exports = function (dbHandler, env, userModel, model) {
  const profileHandler = require('../utils/profileHandler')(model, userModel, dbHandler, env)
  router.post('/signin', (req, res) => {
    let params = req.body;
    // userModel._model.findOneGetUsers(params.email, (err, body) => {
    //   console.log(err)
    //   console.log(body)
    // })
    profileHandler.signinUser(params).then(resp => {
      res.cookie('integri', resp.token, {
        maxAge: (60 * 60 * 1000)
      })
      delete resp.token
      res.json(resp)
    }).catch(err => {
      res.status(err).send(false);
    })
  })
  return router;
}
