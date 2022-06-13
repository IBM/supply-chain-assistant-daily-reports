// A minimal Watson Assistant client for use in the tests, using the Axios
// HTTP client to invoke the Watson Assistant v2 API

const axios = require('axios');

const version = 'version=2020-04-01';

// Create a Watson Assistant session
const createSession = async (url, key) => {
  return (await axios({
    method: 'post',
    url: `${url}?${version}`,
    auth: {
      username: 'apikey',
      password: key
    },
    headers: {
      'Accept': 'application/json'
    }
  })).data.session_id;
};

// Delete the given session
const deleteSession = async (sessionId, url, key) => {
  await axios({
    method: 'delete',
    url: `${url}/${sessionId}?${version}`,
    auth: {
      username: 'apikey',
      password: key
    }
  });
};

// Send a text utterance
const sendText = async (text, sessionId, userId, auth) => {
  const { url, key, jwt, tenantId } = auth;
  return (await axios({
    method: 'post',
    url: `${url}/${sessionId}/message?${version}`,
    auth: {
      username: 'apikey',
      password: key
    },
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    data: {
      user_id: userId,
      input: {
        text: text
      },
      context: {
        integrations: {
          chat: {
            private: {
              jwt: jwt,
              tenant_id: tenantId
            }
          }
        }
      }
    }
  })).data;
};

// Download a skill configuration
const download = async (url, key) => {
  return (await axios({
    method: 'get',
    url: `${url.replace(/message/, '')}?${version}&export=true`,
    auth: {
      username: 'apikey',
      password: key
    },
    headers: {
      'Accept': 'application/json'
    }
  })).data;
};

module.exports.createSession = createSession;
module.exports.deleteSession = deleteSession;
module.exports.sendText = sendText;
module.exports.download = download;

