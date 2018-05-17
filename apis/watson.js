const express = require('express');
module.exports = function (appEnv) {
  const WebSocket = require('ws').Server
  const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
  const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
  const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
  const watson = require('watson-developer-cloud');
  let tts = new TextToSpeechV1({
    username: appEnv.services['text_to_speech'][0].credentials.username,
    password: appEnv.services['text_to_speech'][0].credentials.password,
    url: appEnv.services['text_to_speech'][0].credentials.url
  })
  let TTSParams = {
    voice: 'pt-BR_IsabelaVoice',
    accept: 'audio/wav'
  }
  
  let translatorCredentials = appEnv.services['language_translator'][0].credentials
  let translator = new LanguageTranslatorV2({
    // If unspecified here, the LANGUAGE_TRANSLATOR_USERNAME and LANGUAGE_TRANSLATOR_PASSWORD environment properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    username: translatorCredentials.username,
    password: translatorCredentials.password,
    url: translatorCredentials.url
  });
  const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  let NLUCredentials = appEnv.services['natural-language-understanding'][0].credentials
  let natural_language_understanding = new NaturalLanguageUnderstandingV1({
    username: NLUCredentials.username,
    password: NLUCredentials.password,
    version_date: '2017-02-27'
  });
  let speechToText = new SpeechToTextV1({
    username: appEnv.services['speech_to_text'][0].credentials.username,
    password: appEnv.services['speech_to_text'][0].credentials.password
  });

  let STTParams = {
    model: 'pt-BR_BroadbandModel',
    content_type: 'audio/flac'
  }

  let text_to_speech_authorization = new watson.AuthorizationV1({
    username: appEnv.services['text_to_speech'][0].credentials.username,
    password: appEnv.services['text_to_speech'][0].credentials.password,
    url: appEnv.services['text_to_speech'][0].credentials.url
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
            categories: {
              sentiment: true
            },
            keywords: {
              sentiment: true,
              emotion: true
            },
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
    },
    synthesize (text, options) {
      let params = Object.assign(text, TTSParams, options)
      return tts.synthesize(params)
      // return new Promise((resolve, reject) => {
      //   let params = Object.assign(text, TTSParams, options)
      //   // tts.synthesize(params, (err, audio) => {
      //   //   if (err) {
      //   //     console.log(err);
      //   //     reject(err)
      //   //   } else {
      //   //     resolve(audio)
      //   //   }
      //   // })
      //   return tts.synthesize(params)
      // })
    },
    getTTSToken () {
      return new Promise((resolve, reject) => {
        text_to_speech_authorization.getToken((err, token) => {
          if(err){
            reject(err)
          }else {
            resolve(token)
          }
        })
      })      
    }
  }
}
