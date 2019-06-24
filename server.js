const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const auth = require('./google-auth.js');
const md5 =require("md5");

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

let db = null;
async function main() {

  const MONGO_URL = `mongodb://test:test123@ds133137.mlab.com:33137/heroku_1kn3g63m`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);

  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};

main();

////////////////////////////////////////////////////////////////////////////////

// TODO(you): Add at least 1 GET route and 1 POST route.

async function onCreate(req, res) {
  const UserId = req.body.ID;
  const date = req.body.date;
  const prompt = req.body.prompt;

  const user = db.collection('Diaries');
  //const responseID = await user.insertOne({ user: "root" });

  const doc = {
  	//ID : responseID.insertedId,
    ID : UserId,
    date: date,
    prompt: prompt,
    message: ""
  };
  const collection = db.collection('Entries');
  const response = await collection.insertOne(doc);

  res.json({ Id: response.insertedId });
}
app.post('/create', jsonParser, onCreate);


async function onChange(req, res) {
  const UserId = req.body.UserId;
  const ID = req.body.ID;
  const message = req.body.message;

  const collection = db.collection('Entries');
  const response = await collection.update({ $and: [ {ID: UserId}, {_id: ObjectID(ID)} ] }, {$set:{ message: message }});

  res.json(response);
}
app.post('/change', jsonParser, onChange);


async function onGetByDate(req, res) {
  const UserId = req.body.ID;
  const date = req.body.date;
  const collection = db.collection('Entries');
  const response = await collection.findOne({ $and: [ {ID: UserId}, {date: date} ] });
  res.json(response);
}
app.post('/getByDate', jsonParser, onGetByDate);


async function onFind(req, res) {
  const UserId = req.params.UserId;
  const collection = db.collection('Entries');
  const response = await collection.find({ID: UserId}).toArray();
  res.json( JSON.stringify(response) );
}
app.get('/find/:UserId', onFind);


async function onGetById(req, res) {
  const UserId = req.params.UserId;
  const Id = req.params.Id;
  const collection = db.collection('Entries');
  const response = await collection.findOne({ $and: [ {ID: UserId}, {_id: ObjectID(Id)} ] });
  res.json(response);
}
app.get('/user/:UserId/getById/:Id', onGetById);


async function onLogin(req, res) {
  const idToken = req.body.idToken;
  const userInfo = await auth.validateToken(idToken);
  console.log(userInfo.email);

  const collection = db.collection('Diaries');
  const userQuery = { email: userInfo.email };
  const userResponse = await collection.findOne(userQuery);
  let id = null;
  if (!userResponse) {
    const response = await collection.insertOne(userQuery);
    id = response.insertedId;
  } else {
    id = userResponse._id;
  }

  console.log(id);

  UserId = md5("finalproject" + id + md5(id));
  res.json({ id: UserId });
  
}
app.post('/login', jsonParser, onLogin);


async function onGet(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
}
app.get('*', onGet);