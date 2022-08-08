'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
const admin = require('firebase-admin');

const sid = process.env.TWILIO_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio')(sid, auth_token);
// +12107418096

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// console.log(process.env.FIREBASE_PRIVATE_KEY);

const db = admin.firestore();
// middleware express.urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/reviews', async (req, res) => {
  try {
    const userJSON = {
      name: req.body.name,
      review: req.body.review,
      date: req.body.date
    };
    const reponse = db.collection('reviews').add(userJSON);
    res.send(userJSON);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const reviewRef = db.collection('reviews');
    const response = await reviewRef.get();
    const responseArr = [];
    response.forEach(doc => {
      responseArr.push(doc.data())
    });
    res.send(responseArr);
  } catch (error) {
    res.send(error);
  }
});

// get a single review using ID
app.get('/review/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const reviewRef = db.collection('reviews').doc(id);
    const response = await reviewRef.get();
    const review = response.data();
    res.send(review);
  } catch (error) {
    res.status(404).send(error);
  }
})

app.post('/updateReview/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;
    const reviewRef = await db.collection('reviews').doc(id).update({
      name: newName
    });
    res.send(reviewRef);
  } catch {
    res.status(404).send(error);
  }
})

app.delete('/deleteReview/:id', async (req, res) => {
  try {
    const reviewRef = await db.collection('reviews').doc(req.params.id).delete();
    res.status(200).send('review deleted!')
  } catch (error) {
    res.status(404).send(error);
  }
})

app.post('/appointments', async (req, res) => {
  try {
    const messageJson = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.number,
      service: req.body.service,
      message: req.body.message
    }
    console.log(messageJson);
    const message = `Appointment Request: ${messageJson.service} from ${messageJson.name}:
    phone: ${messageJson.phoneNumber}
    email: ${messageJson.email}
    message: ${messageJson.message}`;
    sendMessage(message);
    res.status(200).send('message sent')
  } catch (error) {
    res.status(404).send("failed to send");
  }
})

const sendMessage = message => {
  try {
    twilio.messages.create({
      from: "+12107418096",
      to: "+14253815116",
      body: message
    })
    console.log('here');
  } catch(error) {
    
  }
}

app.listen(3001, () => console.log(`listening on localhost ${PORT}`));
