const router = require('express').Router();
const bcrypt = require('bcryptjs');
module.exports = function (userModel){
  router.post('/save', (req, res) => {
    let user = {
      _id: req.body.id
    }
    userModel.findOneByID(user, (err, result) => {
      if (err) {
        let newUser = userModel.create({
          _id: user._id,
          name: user.name,
          like: user.like,
          created_at: Date.now(),
          last_change: Date.now(),
          last_login: Date.now(),
          media: {
            integri: {
              email: user.email,
              pwd: bcrypt.hashSync(user.pwd, 10)
            }
          }
        })
        newUser.save((err) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.json('User successfully saved')
          }
        })
      } else {
        result.like = user.like;
        result.last_change = Date.now();
        result.save((err) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.json('User successfully saved')
          }
        })
      }
    })
  });
  
  return router;
}