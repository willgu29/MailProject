import { Router } from 'express'
import Mail from './models/Mail.js'

import nodemailer from 'nodemailer'

const router = Router()


/* GET mails listing. */
router.get('/mails', function (req, res, next) {
  res.json(users)
})

/* GET mails by ID. */
router.get('/mails/:id([a-zA-Z0-9]{20,})', function (req, res, next) {
  const id = parseInt(req.params.id)
  res.json(id)
})



router.get('/mails/tracking.gif', function (req, res, next) {
  console.log(req.query.id)
  console.log('Hello, this is an opened email!')
  // update the mail id
  res.send('none')
})

router.get('/mails/test', function (req, res, next) {
  console.log('sending test mail!')

  // TODO: make secure...
  let transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized:false
      }
  })

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Will Gu" <will@penguinjeffrey.com>', // sender address
      to: 'willgu29@gmail.com', // list of receivers
      subject: 'Hello', // Subject line
      text: 'Hello world!', // plain text body
      html: '<b>Hello world!</b>' // html body
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
