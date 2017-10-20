let router = require('express').Router();
const bcrypt = require('bcryptjs');
let jsonWT = require('jsonwebtoken');

module.exports = function (dbHandler, env, userModel) {
  router.post('/signin', (req, res) => {
    let params = req.body;
    console.log('Sign in')
    console.log(params)
    userModel._model.findOneGetUsers(params.email, (err, body) => {
      console.log(err)
      console.log(body)
    })
    if (params && params.email && params.password) {
      dbHandler.view('profiles', 'getUsers', {key:params.email}, (err, body) => {
        if (body.rows.length > 0 && body.rows[0].value) {
          if (body.rows[0].value.unsuccessfull_attempts >= 3) {
            res.status(403).send(false)
          } else {
            let isMatch = bcrypt.compareSync(params.password, body.rows[0].value.medias.integri.pwd);
            if (isMatch) {
              try {
                let payload = {
                  id : body.rows[0].value._id,
                  name: body.rows[0].value.name,
                  email: body.rows[0].value.medias.integri.email,
                  like: body.rows[0].value.like
                }
  
                let token = jsonWT.sign(payload, env.global_secret, {
                  algorithm: env.hash_algorithm,
                  expiresIn: env.token_expiration
                })
  
                res.cookie('integri', token, {
                  maxAge: (60 * 60 * 1000)
                })
  
                let resp = {
                  authenticationStatus: true
                }
                res.json(resp)
              } catch (err) {
                console.log(err)
                res.status(500).send(false)
              }
            } else {
              res.status(401).send(false)
            }
          }
        } else {
          res.status(404).send(false)
        }
      })
    } else {
      res.status(401).send(false)
    }
  })

  return router;
}
