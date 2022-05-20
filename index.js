require('dotenv').config();
const axios = require('axios');
axios({
  method: 'get',
  baseUrl: 'https://api.twitter.com/',
  url: 'oauth/request_token'
  headers: {
    'Authorization': 'OAuth',
    'oauth_consumer_key': process.env.API_KEY,

  }
});


curl --request POST \
  --url 'https://api.twitter.com/oauth/request_token?oauth_callback=$HTTP_ENCODED_CALLBACK_URL' \
, oauth_nonce="$oauth_nonce", oauth_signature="oauth_signature", oauth_signature_method="HMAC-SHA1", oauth_timestamp="$timestamp", oauth_version="1.0"'
