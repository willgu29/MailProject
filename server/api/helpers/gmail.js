import google from 'googleapis'
var gmail = google.gmail('v1');


class GmailHelper {

  constructor(oauth2Client) {
    this.oauth2Client = oauth2Client
  }

  convertStringToBytes (string) {
    var data = [];
    for (var i = 0; i < string.length; i++){
      data.push(string.charCodeAt(i));
    }
    return data
  }

  convertStringToBase64 (string) {
    let buff = new Buffer(string);
    return buff.toString('base64');
  }

  convertBase64ToString (b64string) {
    let buf = new Buffer(b64string, 'base64');
    return buf.toString('ascii')
  }

  createDraft (threadId, to, subject, messageBody) {
    //Optional raw headers
    //"From: willgu29@gmail.com\n" +
    //

    var raw = this.convertStringToBase64(
     "Content-Type: text/plain; charset=\"UTF-8\"\n" +
     "MIME-Version: 1.0\n" +
     "Content-Transfer-Encoding: 7bit\n" +
     "Subject: "+ subject + "\n" +
     "To: "+ to + "\n\n" +

     messageBody
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    var data = {'message': { 'raw': raw, 'threadId': threadId } };

    gmail.users.drafts.create({
      userId: 'me',
      auth: this.oauth2Client,
      resource: data
    }, function (err, data) {
      if (err) { return console.log('An error occured', err); }
      console.log('drafted created')
    })
  }


}

export default GmailHelper

/* deprecated

\\\\\\\\\\\\\
\\\\\\\\\\\\\\\
||||||||||\

*/
function getMessages(oauth2Client) {
  var res = gmail.users.messages.list({ userId: 'me',
      auth: oauth2Client,
      labelIds: ['UNREAD', 'INBOX'],
      maxResults: 20 },
    function (err, data) {
    if (err) { return console.log('An error occured', err); }

    console.log(data.messages);
    for (var i = 0; i < data.messages.length; i++) {
        var messageId = data.messages[i].id
        gmail.users.messages.get({userId: 'me', auth: oauth2Client, id: messageId }, function (err, message) {
          parseMessage(message)

        })
    }
  });
}
