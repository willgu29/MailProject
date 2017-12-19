import { Router } from 'express'
import Mail from './models/Mail.js'
import bodyParser from 'body-parser'

import nodemailer from 'nodemailer'

const router = Router()


/* GET mails listing. */
router.get('/mails', function (req, res, next) {
  res.json('hi')
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

router.post('/mails/unsubscribe', jsonParser, function (req, res, next) {
  var id = req.body.id
  if (!id) { return res.sendStatus(400) }
  Mail.findById(id).
    populate('campaign').
    exec(function (err, mail) {
      if (err) { return res.sendStatus(404) }
      var campaign = mail.campaign
      mail.unsubscribed = true
      campaign.unsubscribed.push(mail.to)
      mail.save()
      campaign.save()
      res.json('saved')
    })

})


router.get('/mails/tracking.gif', function (req, res, next) {
  const id = req.query.id
  var buf = new Buffer(35);
  buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
  res.send(buf, { 'Content-Type': 'image/gif' }, 200);

  if (! id) { return console.log('no id found') }

  console.log('Hello, this is an opened email!')
  Mail.findById(id).
    populate('campaign').
    exec(function (err, mail) {
      if (err) { return console.log(err) }
      var campaign = mail.campaign
      mail.opened = mail.opened + 1
      campaign.opened = campaign.opened + 1
      mail.save()
      campaign.save()
    })
})

router.get('/mails/test', function (req, res, next) {
  console.log('sending test mail!')
  console.log(req.query.id)

  // TODO: make secure...
  let transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized:false
      }
  })

  var html = '<b>Hello world!</b>'
  var trackingUrl = ('https://mail.penguinjeffrey.com/api/mails/tracking.gif?id=' + req.query.id)
  var trackingCode = '<img src="' + trackingUrl + '" alt="Sent by Penguin Jeffrey" />'
  var unsubscribeCode = ('<a style="text-align: center;" href="https://mail.penguinjeffrey.com/unsubscribe?id="' + req.query.id)
  var html = html + trackingCode + unsubscribeCode
  console.log(html)

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Will Gu" <will@penguinjeffrey.com>', // sender address
      to: 'willgu29@gmail.com', // list of receivers
      subject: 'Hello', // Subject line
      text: 'Hello world!', // plain text body
      html: html // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error)
      }
      console.log('Message %s sent: %s', info.messageId, info.response)
  })
  res.json("hi")


})

export default router
