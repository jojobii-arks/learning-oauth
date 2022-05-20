require('dotenv').config();
const axios = require('axios');
axios({
  method: 'post',
  url: 'https://api.twitter.com/oauth/request_token',
  params: {
    oauth_callback: 'http://127.0.0.1:5500/twitter/return',
  },
  auth: {
    'OAuth oauth_consumer_key': process.env.API_KEY,
    oauth_nonce: btoa(Math.random()),
  },
}).then(({ data }) => console.log(data));
