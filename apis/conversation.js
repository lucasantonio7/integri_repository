const express = require('express');
module.exports = function (appEnv) {
  const api = express.Router();
  const ConversationV1 = require('watson-developer-cloud/conversation/v1');
  let conversationCredentials = appEnv.services['conversation'][0].credentials
  let conversation = new ConversationV1({
    username: conversationCredentials.username,
    password: conversationCredentials.password,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });
  let workspace_id = '4757feda-62f4-4e59-8c50-c1f42a05926c';

  api.get('/init', (req, res) => {
    let text = req.params.text || '';
    conversation.message({
      input: {
        text: text
      },
      workspace_id: workspace_id
    }, function (err, response) {
      if (err) {
        console.error(err);
      } else {
        res.json(response)
      }
    });
  })

  api.get('/message', (req, res) => {
    let _text = req.query.text;
    let _context = JSON.parse(req.query.context);
    conversation.message({
      context: _context,
      input: {
        text: _text,
      },
      workspace_id: workspace_id
    }, function (err, response) {
      if (err) {
        console.error(err);
      } else {
        // Get the context and help with profile
        console.log(response.intents)
        res.json(response)
      }
    });
  })

  return api;
}
