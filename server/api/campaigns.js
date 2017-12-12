import { Router } from 'express'
import Campaign from './models/Campaign.js'

const router = Router()


/* GET mails listing. */
router.get('/campaigns', function (req, res, next) {
  var newCampaign = new Campaign()
  newCampaign.sender = 'test'
  newCampaign.save()
  
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
  const id = parseInt(req.params.id)
  res.json(id)
})


export default router
