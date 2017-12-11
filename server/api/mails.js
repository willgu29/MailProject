import { Router } from 'express'
import Mail from './models/Mail.js'

const router = Router()


/* GET mails listing. */
router.get('/mails', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/mails/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  res.json(id)
})

router.get('/mails/tracking', function (req, res, next) {
  console.log(req.query.id)
  console.log('Hello, this is an opened email!')
  // update the mail id
})

export default router
