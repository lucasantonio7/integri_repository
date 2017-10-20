const express = require('express');
const compression = require('compression');
const app = express();
const Twit = require('twit');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cfenv = require('./cfenv-wrapper');
var appEnv = cfenv.getAppEnv();
const envVars = appEnv.getEnvVars();
// DB
const nano = require('nano')(appEnv.services['cloudantNoSQLDB'][0].credentials.url);
const dbHandler = nano.use('integri');
const couchDBModel = require('couchdb-model');
const myModel = couchDBModel(dbHandler, {
  views: ['_design/profiles/_view/getUsers']
});
const userModel = require('./models/user')(myModel);
// API Call
const watson = require('./apis/watson')(appEnv);
const google = require('./apis/google')(envVars.youtubeAPIKey, dbHandler);
const youtube = require('./apis/youtube');
const profile = require('./apis/profile')(myModel, userModel, envVars.youtubeAPIKey, dbHandler);

let _secret = "projetointegri2017";

app.use(session({
  secret: _secret,
  resave: false,
  saveUninitialized: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());

const access = require('./apis/access')(dbHandler, envVars, userModel, myModel)
const auth = require('./utils/auth')(passport, userModel, envVars, cookieParser)

// This piece of code should be changed
let port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
let serverLocation = "localhost"
passport.use(new Strategy({
  consumerKey: envVars.twitterConsumerKey,
  consumerSecret: envVars.twitterConsumerSecret,
  callbackURL: envVars.callbackURL
}, function (token, tokenSecret, profile, cb) {
  let T = new Twit({
    consumer_key: envVars.twitterConsumerKey,
    consumer_secret: envVars.twitterConsumerSecret,
    access_token: token,
    access_token_secret: tokenSecret
  })
  dbHandler.view('profiles', 'getTwitterUsers', {
    keys: [profile.id]
  }, (err, body) => {
    if (!err && body.rows.length > 0) {
      let user = body.rows[0].value;
      return cb(null, user);
    } else {
      T.get('statuses/user_timeline', {
        user_id: profile.id,
        count: 2
      }, (err, data, response) => {
        let tweets = data;
        let allTranslations = [];
        let like = [];
        tweets.forEach(tweet => {
          allTranslations.push(watson.translate(tweet.text))
        })
        Promise.all(allTranslations).then(translations => {
          let analysisQueue = [];
          translations.forEach(trans => {
            analysisQueue.push(watson.analyze(trans));
          })
          Promise.all(analysisQueue).then(analysis => {
            analysis.forEach(sample => {
              sample.categories = sample.categories.filter(cat => {
                if (cat.score > 0.3) {
                  return true;
                }
              })
              sample.categories.forEach(cat => {
                let query = cat.label.split('/');
                like.push(query[query.length - 1])
              })
            });
            let user = userModel;
            user.like = like;
            user.medias.twitter = profile.id;
            user.name = profile.displayName;
            user.profile_image = profile._json.profile_image_url;
            user.created_at = Date.now();
            user.last_change = Date.now();
            user.last_login = Date.now();
            user.location = profile.location
            user.save((err) => {
              if (err) {
                return cb(null, profile);
              } else {
                return cb(null, user);
              }
            })
          })
        }).catch(err => {
          return cb(null, profile);
        })
      })
    }
  })
}));

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.use(express.static(path.resolve(__dirname, 'dist')))
app.set('views', path.resolve(__dirname, 'dist'))
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index', {
    user: req.user
  })
})

const twitter = require('./apis/twitter.js')(passport, cookieParser, envVars);
const conversation = require('./apis/conversation')(appEnv, dbHandler, envVars.youtubeAPIKey);

app.use('/api/twitter', twitter)
app.use('/api/google', google)
app.use('/api/conversation', conversation)
app.use('/api/profile', profile)
app.post('/api/access_denied', (req, res) => {
  try {
    let status = req.body.access_status
    req.session.denied = status;
  } catch (ex) {
    req.session.denied = false;
  }
  res.end();
})
app.use(access)

app.listen(port, () => {
  console.log('running on port: ', port)
})
