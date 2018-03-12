const fs = require('fs');
module.exports = (model, textModel, dbHandler, env) => {
  return {
    saveText(data) {
      return new Promise((resolve, reject) => {
        let newText = textModel;
        if (data._id) {
          model.findOneByID(data._id, (error, result) => {
            console.log(console)
            if (result) {
              result.title = data.title
              result.text = data.text
              result.tags = data.tags
              result.save((err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(true)
                }
              })
            }
          })
        } else {
          newText.title = data.title
          newText.text = data.text
          newText.tags = data.tags
          newText.save(err => {
            if (err) {
              reject(err)
            } else {
              resolve(true)
            }
          })
        }
      })
    },
    getText(_id) {
      return new Promise((resolve, reject) => {
        model.findOneByID(_id, (error, result) => {
          if (error) {
            reject(error)
          } else {
            // 
          }
        })
      })
    },
    getTextByTitle() {
      return new Promise((resolve, reject) => {

      })
    },
    cleanse() {
      return new Promise((resolve, reject) => {
        model.findAll(function (error, results) {
          if (error) {
            console.error('failed list documents');
          } else {
            results.forEach(doc => {
              if (doc.type === 'text') {
                setTimeout(function() {
                  doc.delete(function (error) {
                    if (error) console.error('failed to delete document');
                    else console.log('document deleted.');
                  });
                }, 1000)
              }
            })
          }
        });
      })
    },
    loadFiles() {
      let pFile = 0;
      // this.cleanse()
      fs.readdirSync('./src/assets/json/texts').forEach(file => {
        let title = file.replace('.json', '');
        let data = JSON.parse(fs.readFileSync('./src/assets/json/texts/' + file, 'utf8'))
        let vm = this;
        setTimeout(() => {
          vm.saveText(data).then(res => {
            pFile++
            console.log('Arquivos processados: ' + pFile)
          }).catch(err => {
            console.log(err)
          })
        }, 250)
      })
    }
  }
}
