import { Router } from 'express'
import Campaign from './models/Campaign.js'
import Mail from './models/Mail.js'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
var amqp = require('amqplib/callback_api');


const router = Router()


/* GET mails listing. */
router.get('/campaigns', function (req, res, next) {
  Campaign.
    find({}).
    exec(function (err, campaigns) {
      if (campaigns) {
        res.json(campaigns);
      } else {
        res.sendStatus(404)
      }
    })
})

/* GET mails by ID. */
router.get('/campaigns/:id([a-zA-Z0-9]{20,})', function (req, res, next) {
  const id = req.params.id
  Campaign.findById(id, function (err, campaign) {
    if (campaign) {
      res.json(campaign);
    } else {
      res.sendStatus(404)
    }
  });
})

var jsonParser = bodyParser.json()

router.post('/campaigns/:id([a-zA-Z0-9]{20,})', jsonParser, function (req, res, next) {
  if (!req.body) { return res.sendStatus(400) }
  var data = req.body
  const id = req.params.id
  const editOption = req.query.edit

  Campaign.findById(id, function (err, campaign) {
    if (err) { return res.sendStatus(404) }
    if (editOption == 'html') {
      campaign.html = data.html
    } else if (editOption == 'emails') {
      var array = data.emails.split(',')
      campaign.to = array
      // campaign.to.push.apply(campaign.to, array)
    } else if (editOption == 'subject') {
      campaign.subject = data.subject
    }
    campaign.save(function (err, updatedCampaign) {
      if (err) { return res.sendStatus(400) }
      res.json(updatedCampaign)
    })

  })
})

router.get('/campaigns/convert/:id([a-zA-Z0-9]{20,})', function (req, res, next) {
  const id = req.params.id
  Campaign.findById(id, function (err, campaign) {
    if (err) { return res.sendStatus(404) }
    if (campaign.to.length <= 0) { return res.json('no emails to convert') }
    for (var i = 0; i < campaign.to.length; i++) {
      var newMail = new Mail()
      newMail.campaign = campaign.id
      newMail.sender = campaign.sender
      newMail.to = campaign.to[i]
      newMail.save()
      // newMail.save().then(function (mail) {
      //   if (mail) {
      //     console.log(mail.to + ' added to campaign!')
      //     campaign.emails.push(mail._id)
      //     campaign.save()
      //   }
      // })
    }
    campaign.isConverted = true
    campaign.save(function (err, updatedCampaign) {
      if (err) { return res.sendStatus(400) }
      res.json(updatedCampaign)
    })
  })
})

var ObjectId = require('mongoose').Types.ObjectId;

router.get('/campaigns/send/:id([a-zA-Z0-9]{20,})', function (req, res, next) {
  const id = req.params.id
  const isAdmin = req.query.isAdmin

  if (isAdmin != 'will') { return res.sendStatus(404) }

  Mail.find({campaign: new ObjectId(id)}).
    populate('campaign').
    exec( function (err, mails) {
      if (err) { return res.sendStatus(404) }
      if (mails.length <= 0) { return res.send('no emails to send!')}
      var counter = 0
      for (var i = 0; i < mails.length; i++) {
        var mail = mails[i]
        if (mail.sent) { continue }
        counter = counter + 1
        publishMail(mail, mail.campaign.subject, mail.campaign.html)
      }
      res.json('emails sent: ' + counter)
    })
})

function publishMail (email, subject, html) {
  var url = process.env.AMQP_URL || ('amqp://' + process.env.AMQP_USER + ":" + process.env.AMQP_PW + '@localhost:5672');
  amqp.connect(url, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'send_mail';
      var object = {
        email: email,
        subject: subject,
        html: html
      }
      ch.assertQueue(q, {durable: true});
      // Note: on Node 6 Buffer.from(msg) should be used
      ch.sendToQueue(q, Buffer.from(JSON.stringify(object)), {persistent: true});
      console.log(" [x] Sent " + object);
    });
    setTimeout(function() { conn.close(); }, 500);

  });
}

router.get('/campaigns/test', function (req, res, next) {
  var newCampaign = new Campaign()
  newCampaign.sender = 'TrackView <info@trackview.net>'
  newCampaign.save(function (err, campaign) {
    if (err) { return res.sendStatus(404) }
    res.json(campaign)
  })
})


export default router
