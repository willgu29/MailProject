import { Router } from 'express'

import users from './users'
import mails from './mails'
import campaigns from './campaigns'

import readline from 'readline'
import axios from 'axios'
import google from 'googleapis'

import User from './models/User.js'

const router = Router()

import GmailHelper from './helpers/gmail.js'
import TemplatePicker from './helpers/template.js'

var templateNames = {
  'NONE_FOUND': -1,
  'AUTO_REPLY': 0
}

//Client Auth
var gmail = google.gmail('v1');
const OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  '45564815574-shpit4idqui4j4tt5o20vtquin9am3md.apps.googleusercontent.com',
  '3P-ZjuUQp4kvaG_NsoT1L90d',
  'https://www.mail.penguinjeffrey.com/api/redirect-gmail'
);
var scopes = [
  'https://www.googleapis.com/auth/gmail.modify'
];

var gmailHelper = new GmailHelper(oauth2Client)
var templatePicker = new TemplatePicker()
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


router.get('/gmail', function (req, res, next) {
  var email = req.query.email;
  if (! email) { return res.sendStatus(400) }
  User.findOne({email: email})
  .exec(function (err, user) {
    if (err) {
      return res.status(404).send('user is not in database')
    } else {
      if (user.tokens && (user.tokens.expiry_date > getTime()) ) {
        oauth2Client.credentials = user.tokens;
        gmailHelper.oauth2Client.credentials = user.tokens;
        gmailHelper.pjLabels = user.pjLabels
        res.send('parsing mail')
        getThreads(oauth2Client);
      } else {
        res.send('fetching token')
        getAccessToken(oauth2Client, function (oauth) {
          getThreads(oauth2Client)
        })
      }
    }
  })
});

function getTime() {
  var d = new Date().getTime()
  return d
  // google access token expires in
  // (d + (1000 * 60 * 60 * 24 * 7)) :7 days
}

function getThreads(oauth2Client) {
  var res = gmail.users.threads.list({
    userId: 'me',
    auth: oauth2Client,
    labelIds: ["UNREAD", "INBOX"],
    maxResults: 40
  }, function (err, data) {
    if (err) { return console.log('An error occured', err); }

    for (var i = 0; i < data.threads.length; i++) {
      var threadId = data.threads[i].id
      gmail.users.threads.get({
        userId: 'me',
        auth: oauth2Client,
        id: threadId
      }, function (err, thread) {
        if (err) { return console.log('An error occured', err); }
        parseThread(thread)
      })
    }
  })
}

function parseThread(thread) {
  var lastMessage = thread.messages[thread.messages.length-1]
  if (! lastMessage.labelIds || (lastMessage.labelIds.indexOf("DRAFT") != -1) || (lastMessage.labelIds.indexOf("SENT") != -1)) {
    return; //no need to look at drafts or sent messages, skip them
  } else {
    parseMessage(lastMessage, function (to, subject, templateIndex) {
      gmailHelper.createDraft(thread.id, to, subject, templateIndex, function(draftId) {
        gmailHelper.sendDraft(draftId, function(threadId) {
          gmailHelper.removeLabels(threadId, ["UNREAD", "INBOX"])
        })
      })

    })
  }
}

function parseMessage(message, callback) {
  // console.log(JSON.stringify(message.snippet))
  // console.log(JSON.stringify(message.payload.parts))
  var subjectIndex = findHeader('Subject', message.payload.headers)
  var subject = message.payload.headers[subjectIndex].value

  var data = findPlainText(message.payload)
  var text = gmailHelper.convertBase64ToString(data)
  //case-insensitive, global replace with ''
  text = text.replace(/Sent from my iPhone/ig, '')

  var fromIndex = findHeader('From', message.payload.headers)
  var from = message.payload.headers[fromIndex].value;

  var snippet = message.snippet

  if (templatePicker.parsePaypal(subject)) { return }


  var templateIndex = chooseTrackViewTemplate(subject, text, snippet)

  if (templateIndex == templateNames['AUTO_REPLY']) {
    console.log(subject + templateIndex)
    // callback(from, subject, templateIndex)
  }
}

function chooseTrackViewTemplate(subject, text, snippet) {
    var language = templatePicker.parseLanguage(subject)
    if (language == 'UNKNOWN') {
      //format l..l l..?l Support for .+ == English
      var isEnglish = templatePicker.parseSupport(subject) ? 'ENGLISH' : 'UNKNOWN'
      if (isEnglish) { language = 'ENGLISH' }
    }

    if (language == 'UNKNOWN') {
      //parse text and go from there (most likely english)
      // translateAndPick(subject, text, snippet)
      return templateNames['NONE_FOUND']
    } else if (language == 'ENGLISH') {
      var isIOS = templatePicker.parseIOS(subject)
      var isEmpty = templatePicker.parseEmpty(text)
      if (isEmpty) {
        return templateNames['AUTO_REPLY']
      }
    } else {
      //not supporting other language codes yet
      return templateNames['NONE_FOUND']
    }


}

function translateAndPick (subject, text, snippet) {
  axios.post('https://www.penguinjeffrey.com/translate', {
    text: snippet
  })
  .then(function (res) {
    // console.log(subject + " " + res.data)
    // see language codes: https://cloud.google.com/translate/docs/translating-text#language-params
    var lang = res.data
    if (lang == 'en') {
      var isEmpty = templatePicker.parseEmpty(text)
      console.log('is empty: ' + isEmpty)
    }
  })
  .catch(function (err) {
    console.log('failed to get language')
  })
}


function findPlainText (payload) {
  var data;
  if (payload.body.size == 0) {
    //find parts
    data = findParts(payload.parts)
  } else {
    data = payload.body.data
  }
  return data

}

function findParts (parts) {
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]
    var mimeType = part.mimeType
    if (mimeType == 'text\/plain') {
      return part.body.data
    } else if (mimeType == 'multipart\/alternative') {
      return findParts(part.parts)
    } else {

    }
  }
}

function findHeader (searchString, headers) {
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    if (header.name == searchString) {
      return i
    }
  }
  return -1 //not found
}


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
  var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',

    // If you only need one scope you can pass it as a string
    scope: 'https://www.googleapis.com/auth/gmail.modify',

    // Optional property that passes state parameters to redirect URI
    // state: 'foo'
  });
  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function (code) {
   // request access token
   rl.question('What email did you auth? ', function (email) {
     oauth2Client.getToken(code, function (err, tokens) {
       if (err) {
         return callback(err);
       }
       // set tokens to the client
       // TODO: tokens should be set by OAuth2 client.
       oauth2Client.credentials = tokens;
       gmailHelper.oauth2Client.credentials = tokens;
       storeTokens(email, tokens)
       callback(oauth2Client);
     });
   });
 });
}

function storeTokens(email, tokens) {
  User.findOne({email: email})
  .exec(function (err, user) {
    if (err) { console.log(err) }
    user.tokens = tokens;
    gmailHelper.pjLabels = user.pjLabels
    user.save(function (err, updatedUser) {
      if (err) { console.log(err) }
      console.log('saved token!')
    })
  })
}


// // retrieve an access token
// getAccessToken(oauth2Client, function () {
//   // retrieve user profile
  // var res = gmail.users.messages.list({ userId: 'me', auth: oauth2Client }, function (err, messages) {
  //   if (err) {
  //     return console.log('An error occured', err);
  //   }
  //   console.log(messages);
  // });
// });

export default router
