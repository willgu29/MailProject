import { Router } from 'express'
import User from './models/User.js'
import bodyParser from 'body-parser'


const router = Router()


/* GET users listing. */
router.get('/users', function (req, res, next) {

})

/* GET user by ID. */
router.get('/users/:id([a-zA-Z0-9]{20,})', function (req, res, next) {

})

router.get('/users/test', function (req, res, next) {
  var newUser = new User();
  newUser.email = 'willgu29@gmail.com';
  newUser.name = 'Will Gu';
  newUser.tokens = {}
  newUser.save(function (err, user) {
    if (err) { return res.status(500).send(err) }
    res.send(user)
  });
})

var jsonParser = bodyParser.json()

router.post('/users/update-email', jsonParser, function (req, res, next) {
  var data = req.body;
  if (! data) { return res.sendStatus(400) }

  User.findOne({email: data.email})
  .exec(function (err, user) {
    if (err) { return res.sendStatus(404) }
    console.log(data.tokens);
    user.tokens = data.tokens;
    user.save(function (err, updatedUser) {
      if (err) {return res.status(500).send(err) }
      res.send('success!')
    })
  })
})

export default router
