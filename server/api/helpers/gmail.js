import google from 'googleapis'
import TemplatePicker from './template.js'

var templatePicker = new TemplatePicker();
var gmail = google.gmail('v1');

var autoReplyEmail = `<p dir="ltr"><span>Dear TrackView user,</span></p>
<p dir="ltr"><span>Thank you for contacting us. Are there any problems we can help you with? Please describe the problems you have in detail so that we can better assist you.</span></p>
<p dir="ltr"><span>To use TrackView, you must install and login to TrackView using the same Gmail account on multiple devices so you can track and monitor each other. Please also give a unique device name to each device(the device name must be less than 7 characters) so that you can distinguish these devices. Also, please turn on the GPS feature on the target device to get accurate location information.</span></p>
<p dir="ltr"><span>Please visit the following websites for more detailed information on how to use TrackView.</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><a href="https://www.youtube.com/watch?v=vJdxiONZAOA"><span>Demo Video</span></a><span>: How to use TrackView</span></p>
<p dir="ltr"><a href="http://trackview.net/manual.html"><span>Online documentation</span></a><span>: Step-by-step instructions</span></p>
<p dir="ltr"><a href="http://trackview.net/faq.html"><span>Online FAQ</span></a><span>: More questions and answers</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><span>Best Regards,</span></p>
<p dir="ltr"><span>TrackView Support Team</span></p>`

var templates = [
  autoReplyEmail
]

class GmailHelper {

  constructor(oauth2Client, labels) {
    this.oauth2Client = oauth2Client
    this.pjLabels = labels
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

  createRawPlainText (to, subject, messageBody) {
    //Optional raw headers
    //"From: willgu29@gmail.com\n" +
    //bit7 == ascii data only
    var subjectMIME;
    if (templatePicker.parseRe(subject)) {
      subjectMIME = 'Subject: ' + subject
    } else {
      subjectMIME = 'Subject: Re: ' + subject
    }
    var raw = this.convertStringToBase64(
     "Content-Type: text/plain; charset=\"UTF-8\"\n" +
     "MIME-Version: 1.0\n" +
     "Content-Transfer-Encoding: bit7\n" +
     subjectMIME + "\n" +
     "To: "+ to + "\n\n" +

     messageBody
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return raw
  }

  createRawHTML (to, subject, htmlTemplate) {
    var subjectMIME;
    if (templatePicker.parseRe(subject)) {
      subjectMIME = 'Subject: ' + subject
    } else {
      subjectMIME = 'Subject: Re: ' + subject
    }

    var raw = this.convertStringToBase64(
      "Content-Type: text/html; charset=\"UTF-8\"\n" +
      "MIME-Version: 1.0\n" +
      "Content-Transfer-Encoding: base64\n" +
      subjectMIME + "\n" +
      "To: "+ to + "\n\n" +

      htmlTemplate
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return raw
  }

  sendDraft (draftId, callback) {
    var data = {'id': draftId }
    var cb = callback;
    gmail.users.drafts.send({
      userId: 'me',
      auth: this.oauth2Client,
      resource: data
    }, function (err, data) {
      if (err) { return console.log('An error occured', err); }
      console.log('drafted sent as: ' + data.id)
      cb(data.threadId)
    })
  }

  createDraft (threadId, to, subject, templateIndex, callback) {

    if (templateIndex < 0 || templateIndex >= templates.length) {
      //ERROR: no supporting template
      console.log('no template found for this email')
      return
    }

    var template = templates[templateIndex]
    var raw = this.createRawHTML(to, subject, template)

    var data = {'message': { 'raw': raw, 'threadId': threadId } };
    var cb = callback;
    gmail.users.drafts.create({
      userId: 'me',
      auth: this.oauth2Client,
      resource: data
    },
    function (err, data) {
      if (err) { return console.log('An error occured', err); }
      console.log('drafted created')
      cb(data.id)
    })
  }
  //labels = array ["INBOX", "UNREAD"]
  removeLabels (threadId, labels) {
    var data = { 'removeLabelIds': labels, 'addLabelIds': this.pjLabels }
    var pjLabels = this.pjLabels
    gmail.users.threads.modify({
      userId: 'me',
      auth: this.oauth2Client,
      id: threadId,
      resource: data
    },
    function (err, data) {
      if (err) { return console.log('An error occured', err); }
      console.log('thread archived + read +' + pjLabels)
    })
  }

}

export default GmailHelper
