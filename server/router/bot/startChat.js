const dialogflowResponse = require("./dialogflowSessionClient");

// Imports the Dialogflow client library
const dialogflow = require("dialogflow");


module.exports = async (req, res) => {
//   await dialogflowInitiate(req.body.message)
//   .then((responses) => console.log(responses))
//   .catch(err => console.log(err))

const private_key = process.env.private_key
    .replace(new RegExp("\\\\n", "g"), "\n")
    .replace("\"", "");

// setup the configuration
const config = {
  credentials: {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  },
};

 // Instantiate a DialogFlow client.
 const sessionClient = new dialogflow.SessionsClient(config);

 const projectId = config.credentials.project_id;
 const sessionId = "123456";
 const languageCode = "BCP-47 language code, e.g. en-US";

 // Define session path
 const sessionPath = sessionClient.sessionPath(projectId, sessionId);

 // The event query request
 const request = {
   session: sessionPath,
   queryInput: {
     event: {
       name: "my-event",
       languageCode,
     },
   },
 }

 const responses = await sessionClient.detectIntent(request).catch(err => console.log(err))
 console.log("EVENT", responses)
 console.log("Detected intent", responses[0].queryResult.intent)
 return responses
}