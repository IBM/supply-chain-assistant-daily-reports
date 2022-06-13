// Test the skill accuracy, send test utterances and measure how accurately
// the skill dialog recognizes the request expressed by the test utterance
// and returns the expected widget layout

const console = require('console');
const client = require('./client.js');
const metrics = require('./metrics.js');
const sterling = require('./sterling.js');

// Configure the assistant URL, API key and UIHub jwt
const { ASSISTANT, KEY, INFOHUB_TENANT } = process.env;

// Test data, a set of test text utterances and the expected label predictions
// i.e. the expected UIHub widget layout ids
const labels = [
  'INVENTORY_FOR_SKU_AT_LOCATION_LAYOUT_TEMPLATE',
  'WATSON_SUGGESTION',
  'NOT_UNDERSTOOD',
  'INTERNAL_ERROR'
];

const XData = [
  {
    label: 'INVENTORY_FOR_SKU_AT_LOCATION_LAYOUT_TEMPLATE',
    text: [
      'how are things this morning for Pharma',
      'morning report for Pharma',
      'show me my morning report for Pharma',
      'what report do I have this morning for Pharma?',
      'whats my morning report for Pharma',

      'can I see the evening summary for Pharma',
      'how did we end the day today for Pharma?',
      'Show me the end of day status for Pharma',
      'show me evening summary report for Pharma',
      'show today\'s end of day summary for Pharma'
    ]
  },
  {
    label: 'WATSON_SUGGESTION',
    text: [
      'show me report for Pharma',
      'What about my report for Pharma?',
      'show me report for Pharma',
      'What about my report for Pharma?'
    ]
  },
  {
    label: 'NOT_UNDERSTOOD',
    text: [
      'is it going to rain today',
      'what items need work today',
      'show me inventory below stock for Pharma',
      'what are my late shipments for Pharma',
      'get expiring inventory for Pharma',
      'show incoming sales orders'
    ]
  }
];

// Unique user id for the tests
const userId = 'quickstart_testuser';

// Create a Watson Assistant session to run the tests and delete it when done
let sessionId, jwt;

beforeAll(async () => {
  sessionId = await client.createSession(ASSISTANT, KEY);
  jwt = await sterling.authenticate();
});

afterAll(async () => {
  await client.deleteSession(sessionId, ASSISTANT, KEY);
});

// Measure the skill's accuracy
describe('Skill dialog', () => {

  test('should return widget layouts with an accuracy >= 0.75', async () => {

    // Send the test utterances to the assistant, and record the expected
    // "true" result vs the result from the skill
    const yTrue = [];
    const yPred = [];
    for (const x of XData)
      for (const text of x.text) {
        yTrue.push(x.label);

        const res = await client.sendText(text, sessionId, userId, {
          url: ASSISTANT,
          key: KEY,
          tenantId: INFOHUB_TENANT,
          jwt: jwt
        });

        // Record the response from the skill
        const status = sterling.getSterlingStatus(res);
        const nonLayoutStatues = [
          'NOT_UNDERSTOOD',
          'INTERNAL_ERROR',
          'WATSON_SUGGESTION'
        ];

        // add each respective status based on the response
        if (status)
          if (nonLayoutStatues.includes(status))
            yPred.push(status);
          else if (status === 'OK') {
            const layouts = sterling.getSterlingLayouts(res);
            if (layouts.length > 0)
              yPred.push(layouts[0].id);
          }
      }

    console.log('Accuracy test results');
    console.log('  yTrue', yTrue);
    console.log('  yPred', yPred);

    // Build a confusion metrics and report accuracy metrics
    const C = metrics.confusion(yTrue, yPred, labels);
    console.log('Confusion matrix');
    console.table(C);

    const report = metrics.report(C, labels);
    console.log('Accuracy', report.accuracy);

    console.log('Detailed report');
    console.table(report.details);

    // Check that the accuracy score is >= 0.75
    expect(report.accuracy).toBeGreaterThanOrEqual(0.75);
  }, 30000);
});

