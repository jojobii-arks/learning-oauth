require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

const Twitter = require('twitter-lite');
const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
});

app.listen(5500, () => console.log('listening on port 5500'));
app.use(cookieParser('bababooey'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/twitter', (req, res) => {
  client
    .getRequestToken('http://127.0.0.1:5500/twitter/login')
    .then(twRes =>
      res.redirect(
        `https://api.twitter.com/oauth/authenticate?oauth_token=${twRes.oauth_token}`
      )
    )
    .catch(console.error);
});

app.get('/twitter/login', (req, res) => {
  let oauthVerifier = req.query.oauth_verifier;
  let oauthToken = req.query.oauth_token;
  client
    .getAccessToken({
      oauth_verifier: oauthVerifier,
      oauth_token: oauthToken,
    })
    .then(twRes => {
      console.log({
        accTkn: twRes.oauth_token,
        accTknSecret: twRes.oauth_token_secret,
        userId: twRes.user_id,
        screenName: twRes.screen_name,
      });

      userId = twRes.user_id;

      res.cookie(
        'twitterlog',
        {
          access_token_key: twRes.oauth_token,
          access_token_secret: twRes.oauth_token_secret,
        },
        {
          expires: 0,
          signed: true,
        }
      );

      res.redirect('/');
    })
    .catch(console.error);
});

app.get('/twitter/pfp', (req, res) => {
  if (!req.signedCookies.twitterlog || !req.signedCookies.twitterlog) {
    res.send({
      message: 'not logged in',
    });
    return;
  }
  const client = new Twitter({
    version: '2',
    extension: false,
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token_key: req.signedCookies.twitterlog.access_token_key,
    access_token_secret: req.signedCookies.twitterlog.access_token_secret,
  });
  client
    .get('users/me', {
      'user.fields': 'profile_image_url',
    })
    .then(twRes => {
      res.send(twRes.data);
    })
    .catch(console.error);
});

app.get('/logout', (req, res) => {
  res.clearCookie('twitterlog');
  res.redirect('/');
});
