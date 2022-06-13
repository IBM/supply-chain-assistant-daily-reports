# supply-chain-assistant-daily-reports

A sample assistant for IBM Supply Chain Intelligence Suite (SCIS)

## Introduction

A team of supply chain analysts needs to review the status of the inventory
for the product categories they work on, N95 masks, swabs or syringes for
example, typically on a daily basis.

They develop a new Watson Assistant skill for the Sterling AI Assistant that
brings up that status when they say something like "Show me the daily status
for Pharma" for example.

The list of inventory for a product category is already implemented as a
UIHub layout in the SCIS. The new skill simply reuses that UIHub layout,
providing convenient access to it from natural language.

This sample project illustrates how to create the Watson Assistant skill, train
it with example utterances, recognize the product category mentioned in an
utterance, and have it return the specification of the UIHub layout presenting
the inventory data that the team wants to see.

The project also contains example test programs that illustrate how to test
that the skill accurately recognizes the user's intent and returns the expected
UIHub layout.

Documentation of how to design, build and deploy Watson Assistant skills for
the Sterling AI assistant can be found in the
[Sterling Knowledge Center](https://www.ibm.com/docs/en/scis?topic=skills-adding-supply-chain-business-assistant).

## Uploading the skill to Watson Assistant

Before testing the skill you need to upload it to Watson Assistant.

Please do the following:

* Create a Watson Assistant service resource in an IBM cloud account.

* In the Watson Assistant tool, select *Create assistant* and create
an assistant named **Daily Report Sample**, which will be necessary
to host the skill.

* Write down the *assistant URL* and *API key* for the
**Daily Report Sample** assistant, found on that assistant's *Settings*
page.

* In the Watson Assistant tool, select *Create skill*, choose *Dialog Skill*,
then select *Upload skill* to upload `src/skill.json`
into the new skill.

* Write down the *Legacy v1 workspace URL* for the **Daily Report Sample**
skill, found on the skill's *API details* page.

* Open the **Daily Report Sample** assistant again, select
*Add dialog skill* to add the **Daily Report Sample** skill to the
assistant.

## Building the project

The project contains a set of Node.js sample test programs which can be used
to test the skill.

To build the test programs, make sure you have **Node.js** and **yarn**
installed, then run the following command:

```
yarn build
```

## Testing the skill

The sample test programs illustrate how to test that the skill functions as
expected and with good language recognition accuracy.

Configure the following environment variables related to Watson Assistant:

```
export ASSISTANT="the assistant URL for the Daily Report Sample assistant"
export KEY="the API key for the Daily Report Sample assistant"
export SKILL="the legacy v1 workspace URL for the Daily Report Sample skill"
```
The *assistant URL* and *API key* can be found on the *Settings* page of the
**Daily Report Sample** assistant.

The skill's *Legacy v1 workspace URL* can be found on the *API details* page
of the **Daily Report Sample** skill.

Since this sample uses the [Named Entity Recognition API](https://developer.ibm.com/apis/catalog/scintellsuite--supply-chain-intelligence-suite/api/API--scintellsuite--named-entities-recognition-service#post998085110),
you will need to authenticate using a [JSON Web Token](https://jwt.io/) which can be obtained from the 
[Saascore Authentication API](https://developer.ibm.com/apis/catalog/scintellsuite--supply-chain-intelligence-suite/api/API--scintellsuite--platform-authentication-retrieve/#get44848312).

Configure the following environment variables related to authentication:

```
export SCIS_ORGANIZATION="the ID for your SCIS organization"
export INFOHUB_TENANT="the Infohub tenant ID associated with your SCIS organization"
export SAASCORE_BASIC_USERNAME="the username (IBMID) of the authenticating user"
export SAASCORE_BASIC_PASSWORD="the corresponding password of the authenticating user"
```

Run the following command:

```
yarn test
```

Note: certain test cases assume that specific entities are contained  in your organization's business data, e.g. 'Pharma' as short for Pharmaceutical in the test question "Show me the evening status for Pharma". You may simply replace this value with a value from your own organization's business data. 

## Registering the skill with the Sterling Assistant

To register the sample skill with the Sterling AI Assistant, follow the steps
described in
[Registering your skills with the Sterling Assistant](https://www.ibm.com/docs/en/scis?topic=assistant-registering-your-skills-supply-chain-business).

