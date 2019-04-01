const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const serviceAccount = require(__dirname + "/dutchpay-109be-firebase-adminsdk-fyvdn-29a5c3a567.json");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

    })
    .catch(function(error) {
      console.log("Error creating new user: ", error);
    });
});

app.listen(3000, function() {
  console.log("Server started at port 3000");
});
