let router = require('express').Router();
let bCrypt = require('bcrypt-nodejs');
let jsonWT = require('jsonwebtoken');

module.exports = function (dbHandler, env) {
  router.post('/signin', (req, res) => {
    let params = req.body;

    if (params && params.email && params.password) {
      dbHandler.view('profiles', 'getUsers', [params.email], (err, body) => {
        if (body.rows[0].value) {
          let isMatch = bCrypt.compareSync(params.password, body.rows[0].value.medias.integri.pwd);
          if (isMatch) {
            let payload = {
              user: body.rows[0].value.name,
              email: body.rows[0].value.medias.integri.email
            }

            let token = jsonWT.sign(payload, env.global_secret)
          }
        }
      })
    }
  })
}
