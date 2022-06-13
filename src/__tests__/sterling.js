// Sterling specific helper functions

/* eslint-disable curly */

const axios = require('axios');
const _ = require('lodash');

// returns a signed JWT for use with all SCIS APIs
const authenticate = async () => {
  const tenantId = process.env.INFOHUB_TENANT;
  const orgId = process.env.SCIS_ORGANIZATION;
  const user = process.env.SAASCORE_BASIC_USERNAME;
  const pass = process.env.SAASCORE_BASIC_PASSWORD;
  const auth = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

  return axios
    .get('https://api.ibm.com/saascore/run/authentication-retrieve', {
      params: { orgId },
      headers: {
        'Authorization': auth,
        'X-IBM-Client-Id': `saascore-${tenantId}`
      }
    })
    .then(({ data }) => data);
};

// returns the Sterling response status, e.g. OK, NOT_UNDERSTOOD
const getSterlingStatus = (response) => {
  const userDefined = _.chain(response)
    .get('output.generic', [])
    .find({ response_type: 'user_defined' })
    .get('user_defined')
    .value();

  const baseStatus = _.get(userDefined, 'sterling_status_response');
  const layoutStatus = _.get(userDefined, 'sterling_layout_template_response');
  const suggestions = _.get(response, 'output.generic[0].suggestions');

  if(baseStatus)
    return baseStatus.status;
  
  if(layoutStatus)
    return layoutStatus.status;

  if(suggestions)
    return 'WATSON_SUGGESTION';

  return null;
};

// returns any uihub layouts associated with the response
const getSterlingLayouts = (response) => {
  return _.chain(response)
    .get('output.generic', [])
    .find((g) => _.has(g, 'user_defined.sterling_layout_template_response'))
    .get('user_defined')
    .get('sterling_layout_template_response.uihub_layout_templates', [])
    .value();
};

if (require.main === module) {
  authenticate().then(console.dir);
}

module.exports.authenticate = authenticate;
module.exports.getSterlingStatus = getSterlingStatus;
module.exports.getSterlingLayouts = getSterlingLayouts;
