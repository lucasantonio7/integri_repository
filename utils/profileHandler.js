module.exports = (model, userModel, dbHandler) => {
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
    }
  }
}
