const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// const serviceAccount = require(__dirname + "/dutchpay-109be-firebase-adminsdk-fyvdn-29a5c3a567.json");

const app = express();

const serviceAccount = {
  "type": process.env.type,
  "project_id": process.env.project_id,
  "private_key_id": process.env.private_key_id,
  "private_key": process.env.private_key,
  "client_email": process.env.client_email,
  "client_id": process.env.client_id,
  "auth_uri": process.env.auth_uri,
  "token_uri": process.env.token_uri,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.client_x509_cert_url
}

app.use(bodyParser.urlencoded({
  extended: true
}));

admin.initializeApp({
  credential: admin.credential.cert(JSON.stringify(serviceAccount)),
  databaseURL: 'https://dutchpay-109be.firebaseio.com'
});

var db = admin.firestore();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName
    })
    .then(function(userRecord) {
      console.log("Successfully created new user: ", userRecord.uid);
      let data = {
        email: req.body.email,
        username: req.body.displayName
      };
      db.collection('users').doc(userRecord.uid).set(data);

      res.send("Success!");
    })
    .catch(function(error) {
      console.log("Error creating new user: ", error);

      res.send("Failure");
    });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started at port 3000");
});
