'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const fireDb = require('./modules/firestore');
const message = require('./modules/twilio');

app.use(express.json());
app.use(cors());

const sid = process.env.TWILIO_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio')(sid, auth_token);

app.post('/reviews', fireDb.addReview);
app.get('/reviews', fireDb.getAllReviews);
app.get('/review/:id', fireDb.getOneReview); // get a single review using ID
app.post('/updateReview/:id', fireDb.updateReview);
app.delete('/deleteReview/:id', fireDb.deleteReview);

app.post('/appointments', message.appointment);

app.get('*', res => {
  res.send('nothing is here. Try refreshing...')
})

app.listen(3001, () => console.log(`listening on localhost ${PORT}`));
