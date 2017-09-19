const express = require('express');
module.exports = function (appEnv) {
  const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
  let translatorCredentials = appEnv.services['language_translator'][0].credentials
  let translator = new LanguageTranslatorV2({
    // If unspecified here, the LANGUAGE_TRANSLATOR_USERNAME and LANGUAGE_TRANSLATOR_PASSWORD environment properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    username: translatorCredentials.username,
    password: translatorCredentials.password,
    url: translatorCredentials.url
  });
  var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  let NLUCredentials = appEnv.services['natural-language-understanding'][0].credentials
  var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    username: NLUCredentials.username,
    password: NLUCredentials.password,
    version_date: '2017-02-27'
  });
  return {
    translate(source) {
      return new Promise((resolve, reject) => {
        let translatorParams = {
          text: source,
          source: 'pt',
          target: 'en'
        }

        translator.translate(translatorParams, (err, translation) => {
          if (err) {
            reject(err);
          } else {
            resolve(translation.translations[0].translation)
          }
        })
      })
    },
    analyze(text) {
      return new Promise((resolve, reject) => {
        let parameters = {
          text: text,
          features: {
            categories: {},
            keywords: {},
            concepts: {}
          }
        }
        natural_language_understanding.analyze(parameters, (err, response) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(response)
            resolve(response)
          }
        })
      })
    }
  }
}
