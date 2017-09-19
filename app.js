const express = require('express');
const app = express();
const Twit = require('twit');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cfenv = require('./cfenv-wrapper');
var appEnv = cfenv.getAppEnv();
const envVars = appEnv.getEnvVars();

let _secret = "projetointegri2017";

app.use(session({
  secret: _secret,
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());

// This piece of code should be changed
let port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
let serverLocation = "localhost"
passport.use(new Strategy({
  consumerKey: envVars.twitterConsumerKey,
  consumerSecret: envVars.twitterConsumerSecret,
  callbackURL: "http://" + serverLocation + ":" + 8080 + "/api/twitter/return"
}, function (token, tokenSecret, profile, cb) {
  let T = new Twit({
    consumer_key: envVars.twitterConsumerKey,
    consumer_secret: envVars.twitterConsumerSecret,
    access_token: token,
    access_token_secret: tokenSecret
  })

  T.get('statuses/user_timeline', {
    user_id: profile.id,
    count: 20
  }, (err, data, response) => {
    console.log(data);
    // Get the data send to translate and then to the NLU
    return cb(null, profile);
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

app.get('/', (req, res) => {
  res.render('index', {
    user: req.user
  })
})

const twitter = require('./apis/twitter.js')(passport);

app.use('/api/twitter', twitter)

app.listen(port, () => {
  console.log('running on port: ', port)
})
