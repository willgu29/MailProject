import { Router } from 'express'
import Mail from './models/Mail.js'
import Campaign from './models/Campaign.js'
import bodyParser from 'body-parser'

import nodemailer from 'nodemailer'

const router = Router()


/* GET mails listing. */
router.get('/mails', function (req, res, next) {
  Mail.find({}, function (err, mails) {
    if (err) { return res.sendStatus(404) }
    res.json(mails)
  })
})

/* GET mails by ID. */
router.get('/mails/:id([a-zA-Z0-9]{20,})', function (req, res, next) {
  const id = req.params.id

  Mail.findById(id).
    exec(function (err, mail) {
      if (err) { return res.sendStatus(404) }
      res.json(mail)
    })
})

var jsonParser = bodyParser.json()

router.post('/mails/sent/', jsonParser, function (req, res, next) {
  var id = req.body.id
  if (!id) { return res.sendStatus(400) }

  Mail.findById(id).
    populate('campaign').
    exec(function (err, mail) {
      if (err) { return res.sendStatus(404) }
      var campaign = mail.campaign
      Campaign.update({ _id: campaign.id }, { $inc: {'sent' : 1 }}, function (err, updatedCampaign) {

      })
      mail.sent = true
      mail.save()
      res.json('updated mail: sent')
    });
})


router.post('/mails/unsubscribe', jsonParser, function (req, res, next) {
  var id = req.body.id
  if (!id) { return res.sendStatus(400) }

  Mail.findById(id).
    populate('campaign').
    exec(function (err, mail) {
      if (err) { return res.sendStatus(404) }
      var campaign = mail.campaign
      Campaign.update({ _id: campaign.id }, { $push: {'unsubscribed' : mail.to }}, function (err, updatedCampaign) {

      })
      mail.unsubscribed = true
      mail.save()
      res.json('updated mail: unsubscribed')
    })

})


router.get('/mails/tracking.gif', function (req, res, next) {
  const id = req.query.id
  var buf = new Buffer(35);
  buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
  res.send(buf, { 'Content-Type': 'image/gif' }, 200);

  if (! id) { return console.log('no id found') }

  Mail.findById(id).
    populate('campaign').
    exec(function (err, mail) {
      if (err) { return console.log(err) }
      var campaign = mail.campaign
      Campaign.update({ _id: campaign.id }, { $inc: {'opened' : 1 }}, function (err, updatedCampaign) {

      })
      mail.opened = mail.opened + 1
      mail.save()
    })
})

export default router
