import { Router } from 'express'
import Campaign from './models/Campaign.js'
import Mail from './models/Mail.js'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'

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
      console.log(campaign.html)
    } else if (editOption == 'emails') {
      var array = data.emails.split(',')
      campaign.to.push.apply(campaign.to, array)
      console.log(campaign.to)
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
      newMail.save().then(function (mail) {
        if (mail) {
          console.log(mail.to + ' added to campaign!')
          campaign.emails.push(mail.id)
          campaign.save()
        }
      })
    }
    campaign.isConverted = true
    campaign.save(function (err, updatedCampaign) {
      if (err) { return res.sendStatus(400) }
      res.json(updatedCampaign)
    })
  })
})

router.get('/campaigns/send/:id([a-zA-Z0-9]{20,})', function (req, res, next) {
  const id = req.params.id
  const isAdmin = req.query.isAdmin

  if (isAdmin != 'will') { return res.sendStatus(404) }

  Campaign.findById(id).
    populate('emails').
    exec( function (err, campaign) {
      if (err) { return res.sendStatus(400) }

      var html = campaign.html
      var subject = campaign.subject
      for (var i = 0; i < campaign.emails.length; i++) {
        var email = campaign.emails[i]
        sendMail(email.id, email.sender, email.to, subject, html)
        email.sent = true
        campaign.sent = campaign.sent + 1
        email.save()
        campaign.save()
      }
      res.json('emails sent')
    })


})

let transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized:false
    }
})

function sendMail (mailId, from, to, subject, html) {
  var trackingUrl = ('https://mail.penguinjeffrey.com/api/mails/tracking.gif?id=' + mailId)
  var trackingCode = '<img src="' + trackingUrl + '" alt="Sent by Penguin Jeffrey" />'
  var html = html + trackingCode
  console.log(html)

  // setup email data with unicode symbols
  let mailOptions = {
      from: from || '"Will Gu" <will@penguinjeffrey.com>', // sender address
      to: to,
      subject: subject,
      text: 'This email requires html to be displayed!',
      html: html // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error)
      }
      console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

router.get('/campaigns/test', function (req, res, next) {
  var newCampaign = new Campaign()
  newCampaign.sender = 'Trackview <qunshan@trackview.co>'
  newCampaign.save(function (err, campaign) {
    if (err) { return res.sendStatus(404) }
    res.json(campaign)
  })
})


export default router
