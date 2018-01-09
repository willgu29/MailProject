import { Router } from 'express'

import users from './users'
import mails from './mails'
import campaigns from './campaigns'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(mails)
router.use(campaigns)

router.get('/redirect-gmail', function (req, res, next) {
  var code = req.query.code;
  if (! code) { return res.sendStatus(404) }
  console.log(code);
  res.send(code)

})

export default router
