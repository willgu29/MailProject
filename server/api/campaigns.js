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
    },
    name: "penguinjeffrey.com",
    dkim: {
      domainName: 'penguinjeffrey.com',
      keySelector: 'mail',
      privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIICXgIBAAKBgQDi/oIAkxUb/2WhCFjZaA07mSteuVY/nJgsUMLzb2hBRAdqdqmJ
      UdzHfkKqihZItJ5xG7TYDbr6okZZSNaFcld0g9zw7wDIG4fQcFj9UmKrhMQhooPr
      oKjvRhwAJG/rnXhw4fuB2Zw7urA3jR5SUi/Gf4JCDBdHB34TroouExb/mwIDAQAB
      AoGBALC9odN4sjL+hM8BhMyia8s/07kJbdJRx1qZ93E8CVzn7y5B/ndhOhpKgPXw
      VrF9kPBYtlKTPkbwGv5h7EYzZUtnYINMbrT+RRc/taxsJoqrM0Dw3FOhlO5VIM7v
      YvNEKsnomjajlm35FEuGYlMWRBVnyuw08POZudT+9EvkzhBBAkEA/+a1kUCSz/S+
      DPbzDAQ2tWO55BWuRllUQeJOGC0crCrbJWj2wguETzHYsYao5oFMZTMHfJ2tgni9
      hQv0Kg91YwJBAOMU8RJoXa+ew3WE78v7pnfaWq3tySH/vNb/a16WjnNKGlM3yD+d
      T50Wwms5x3BC1kXk7oFxKyzwEk9p++V83mkCQAhOJZBsRxeGuvBSx3qZXGkwrmTP
      q1NPLOPig2RXenm//lLNgEy18PpdBMpmM28fvSn/qPuLZok4f/YkeC0xST8CQQDA
      8RYz0cFoarkgrSciZlt3Emxhw9xVqvlEpBkScVHv21Kqyoa2pm7yxlfCy4ENfXya
      Pn34NbO9pu2n1CFXR9WhAkEA5PtaN+LI05DaWeyk2CW7e9n5DRqggj8O6LfVELRd
      DPMAyDSy2bU2uO3YxCEfFajjuCgAeictIxoAajllt6/ZyA==
      -----END RSA PRIVATE KEY-----`
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
