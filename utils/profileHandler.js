const bcrypt = require('bcryptjs');
const jsonWT = require('jsonwebtoken');
module.exports = (model, userModel, dbHandler, env) => {
  return {
    updateProfile(data) {
      return new Promise((resolve, reject) => {
        model.findOneByID(data._id, (error, result) => {
          if (error) {
            reject({
              status: 500,
              error: error
            })
          } else {
            result.name = data.name;
            result.like = data.like;
            result.skills = data.skills;
            result.causes = data.causes;
            result.location = data.location;
            result.save(err => {
              if (err) {
                reject({
                  status: 500,
                  error: error
                })
              } else {
                resolve('User successfully updated')
              }
            })
          }
        })
      })
    },
    signinUser(params) {
      return new Promise((resolve, reject) => {
        if (params && params.email && params.password) {
          dbHandler.view('profiles', 'getUsers', {
            key: params.email
          }, (err, body) => {
            if (body.rows.length > 0 && body.rows[0].value) {
              if (body.rows[0].value.unsuccessfull_attempts >= 3) {
                reject(403)
              } else {
                let isMatch = bcrypt.compareSync(params.password, body.rows[0].value.medias.integri.pwd);
                if (isMatch) {
                  try {
                    let payload = {
                      id: body.rows[0].value._id,
                      name: body.rows[0].value.name,
                      email: body.rows[0].value.medias.integri.email,
                      location: body.rows[0].value.location,
                      medias: body.rows[0].value.medias,
                      like: body.rows[0].value.like,
                      role: body.rows[0].value.role
                    }
                    let resp = {
                      token: jsonWT.sign(payload, env.global_secret, {
                        algorithm: env.hash_algorithm,
                        expiresIn: env.token_expiration
                      }),
                      authenticationStatus: true,
                      role: body.rows[0].value.role
                    }
                    resolve(resp)
                  } catch (err) {
                    console.log(err)
                    reject(500)
                  }
                } else {
                  reject(401)
                }
              }
            } else {
              reject(404)
            }
          })
        } else {
          reject(401)
        }
      })
    }
  }
}
