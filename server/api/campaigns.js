import { Router } from 'express'
import Campaign from './models/Campaign.js'
import Mail from './models/Mail.js'
import bodyParser from 'body-parser'

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

router.get('/campaigns/test', function (req, res, next) {
  var newCampaign = new Campaign()
  newCampaign.sender = 'qunshan@trackview.co'
  newCampaign.save(function (err, campaign) {
    if (err) { return res.sendStatus(404) }
    res.json(campaign)
  })
})


export default router
