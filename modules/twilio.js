'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const sid = process.env.TWILIO_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio')(sid, auth_token);

const message = {};

const sendMessage = message => {
  twilio.messages.create({
    from: "+12107418096",
    to: "+14253815116",
    body: message
  })
};

message.appointment = async (req, res) => {
  try {
    const messageJson = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.number,
      service: req.body.service,
      message: req.body.message
    }
    console.log(messageJson);
    const message = `You have a new appointment request! 
    Client Name: ${messageJson.name}
    Appointment type: ${messageJson.service}
    phone: ${messageJson.phoneNumber}
    email: ${messageJson.email}
    message: ${messageJson.message}`;
    sendMessage(message);
    res.status(200).send('message sent!')
  } catch (error) {
    res.status(404).send("failed to send message");
  }
};

message.newReview = async (req, res) => {
  console.log('hello');
  try {
    const review = {
      name: req.body.name,
      email: req.body.email,
      service: req.body.service,
      review: req.body.review,
      date: req.body.date
    };
    const message = `New ${review.service} review:
      name: ${review.name}
      review: ${review.review} 
      date: ${review.date}
      email: ${review.email}`;
    console.log(message);
    sendMessage(message);
    res.status(200).send('message sent!');
  } catch (error) {
    res.status(404).send("failed to send message");
  }
};

module.exports = message;