'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const message = require('./twilio');

console.log('firstore configuration');
console.log(process.env);

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

console.log('firebase initialize')

const db = admin.firestore();
app.use(express.urlencoded({ extended: true }));

// Create an object to hold all methods 
const firestore = {};

firestore.addReview = async (req, res) => {
  try {
    const userJSON = {
      name: req.body.name,
      email: req.body.email,
      service: req.body.service,
      review: req.body.review,
      date: req.body.date
    };
    const reponse = db.collection('reviews').add(userJSON);
    res.status(200).send(userJSON);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

console.log('get reviews');

firestore.getAllReviews = async (req, res) => {
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
};

firestore.getOneReview = async (req, res) => {
  try {
    const id = req.params.id;
    const reviewRef = db.collection('reviews').doc(id);
    const response = await reviewRef.get();
    const review = response.data();
    res.send(review);
  } catch (error) {
    res.status(404).send(error);
  }
}

firestore.updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;
    const reviewRef = await db.collection('reviews').doc(id).update({
      name: newName
    });
    res.status(200).send('successfully updated');
  } catch {
    res.status(404).send(error);
  }
};

firestore.deleteReview = async (req, res) => {
  try {
    const reviewRef = await db.collection('reviews').doc(req.params.id).delete();
    res.status(200).send('review deleted!')
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = firestore;
