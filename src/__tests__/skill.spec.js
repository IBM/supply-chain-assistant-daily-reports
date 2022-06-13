// Tests the sample skill intent recognition, dialog logic and checks
// some of the dialog node settings

const sterling = require('./sterling.js');
const client = require('./client.js');

// Configure the assistant URL, API key, skill URL and UIHub jwt
const { ASSISTANT, KEY, SKILL, INFOHUB_TENANT } = process.env;

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

// Test the skill intent model
describe('Skill intent model', () => {

  test('should recognize the morning status intent', async () => {
    const text = 'What about my morning report for Pharma';
    const res = await client.sendText(text, sessionId, userId, {
      url: ASSISTANT,
      key: KEY,
      tenantId: INFOHUB_TENANT,
      jwt: jwt
    });

    const intent = res.output.intents[0].intent;
    expect(intent).toEqual('quickstart_morning_status');
  });

  test('should recognize the evening status intent', async () => {
    const text = 'Show me the evening status for Pharma';
    const res = await client.sendText(text, sessionId, userId, {
      url: ASSISTANT,
      key: KEY,
      tenantId: INFOHUB_TENANT,
      jwt: jwt
    });

    const intent = res.output.intents[0].intent;
    expect(intent).toEqual('quickstart_evening_status');
  });
});

// Test the skill dialog
describe('Skill dialog', () => {

  test('should return the morning status UIHub widget layout', async () => {
    const text = 'What about my morning report for Pharma';
    const res = await client.sendText(text, sessionId, userId, {
      url: ASSISTANT,
      key: KEY,
      tenantId: INFOHUB_TENANT,
      jwt: jwt
    });

    // Check the skill's response
    expect(res.output.generic[1]).toEqual({
      user_defined: {
        sterling_layout_template_response: {
          status: 'OK',
          uihub_layout_templates: [
            {
              id: 'INVENTORY_FOR_SKU_AT_LOCATION_LAYOUT_TEMPLATE',
              size: 'small',
              parameters: {
                category: 'Pharma'
              }
            },
            {
              id: 'INVENTORY_FOR_SKU_AT_LOCATION_VIEW_ALL_LAYOUT_TEMPLATE',
              size: 'large',
              parameters: {
                category: 'Pharma'
              }
            }
          ]
        }
      },
      response_type: 'user_defined'
    });
  });

  test('should return the evening status UIHub widget layout', async () => {
    const text = 'Show me the evening status for Pharma';
    const res = await client.sendText(text, sessionId, userId, {
      url: ASSISTANT,
      key: KEY,
      tenantId: INFOHUB_TENANT,
      jwt: jwt
    });

    // Check the skill's response
    expect(res.output.generic[1]).toEqual({
      user_defined: {
        sterling_layout_template_response: {
          status: 'OK',
          uihub_layout_templates: [
            {
              id: 'INVENTORY_FOR_SKU_AT_LOCATION_LAYOUT_TEMPLATE',
              size: 'small',
              parameters: {
                category: 'Pharma'
              }
            },
            {
              id: 'INVENTORY_FOR_SKU_AT_LOCATION_VIEW_ALL_LAYOUT_TEMPLATE',
              size: 'large',
              parameters: {
                category: 'Pharma'
              }
            }
          ]
        }
      },
      response_type: 'user_defined'
    });
  });

  test('should indicate when the input is not understood', async () => {
    const text = 'Is it going to rain today';
    const res = await client.sendText(text, sessionId, userId, {
      url: ASSISTANT,
      key: KEY,
      tenantId: INFOHUB_TENANT,
      jwt: jwt
    });

    // Check the skill's response
    expect(res.output.generic[1]).toEqual({
      user_defined: {
        sterling_status_response: {
          status: 'NOT_UNDERSTOOD'
        }
      },
      response_type: 'user_defined'
    });
  });

  test('should use recommended dialog settings', async () => {
    // Download the skill.json configuration
    const config = await client.download(SKILL, KEY);

    // If your skill utilizes Watson Assistant features such as
    // off topic and spelling auto correct, it's a good practice to
    // retest those flags at each update to avoid accidental changes
    expect(config.system_settings.off_topic.enabled).toBe(true);
    expect(config.system_settings.spelling_auto_correct).toBe(true);

    // An example of how to check to node-specific disambiguation and auto
    // learning
    expect(config.system_settings.disambiguation.enabled).toBe(true);
    expect(config.learning_opt_out).toBe(false);

    // Check that the dialog contains the expected node names for the
    // morning and evening status
    const names = config.dialog_nodes.map((node) => node.title);
    expect(names).toContain('Quickstart morning status');
    expect(names).toContain('Quickstart evening status');

    // Check that the nodes returning the morning and evening statuses are
    // included in disambiguation while the others are excluded
    config.dialog_nodes.forEach((node) => {
      if(node.type !== 'standard')
        return;
      if(node.title === 'Quickstart morning status' ||
        node.title === 'Quickstart evening status')
        expect(node.disambiguation_opt_out).toBe(undefined);
      else
        expect(node.disambiguation_opt_out).toBe(true);
    });
  });

});

