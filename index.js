require('dotenv').config();
const express = require('express');
const app = express();

const Twitter = require('twitter-lite');
const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
});

app.listen(5500, () => console.log('listening on port 5500'));

app.use('/', express.static('test-site'));

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
      res.redirect('/');
    })
    .catch(console.error);
});
