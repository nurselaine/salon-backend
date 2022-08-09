'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const fireDb = require('./modules/firestore');
const message = require('./modules/twilio');


console.log("Application Express Server Init:");
app.use(express.json());
app.use(cors());

console.log("Application Express Server Config:");

const sid = process.env.TWILIO_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio')(sid, auth_token);

console.log("Application Express Server Routes:");

app.get('/', (req, res) => {
  try {
    console.log('Loann\'s salon page')
    res.status(200).send('Hello');
  } catch (error) {
    res.status(400).send(error);
  }
})

app.post('/reviews', fireDb.addReview);
app.get('/reviews', fireDb.getAllReviews);
app.get('/review/:id', fireDb.getOneReview); // get a single review using ID
app.post('/updateReview/:id', fireDb.updateReview);
app.delete('/deleteReview/:id', fireDb.deleteReview);

app.post('/appointments', message.appointment);
app.post('/newReview', message.newReview);

console.log("Application Express Server Route Error Handler:");

app.get('*', res => {
  res.send('nothing is here. Try refreshing...')
})

console.log("Application Express Server Listen");

app.listen(PORT, () => console.log(`listening on localhost ${PORT}`));
