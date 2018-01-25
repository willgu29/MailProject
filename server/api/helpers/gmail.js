import google from 'googleapis'
import TemplatePicker from './template.js'

var templatePicker = new TemplatePicker();
var gmail = google.gmail('v1');

var autoReplyEmailEN = `<p dir="ltr"><span>Dear TrackView user,</span></p>
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

var autoReplyEmailES = `<p dir="ltr"><span>Estimado usuario de TrackView,</span></p>
<p dir="ltr"><span>Gracias por contactarnos. ¿Hay algún problema con el que podamos ayudarlo? Por favor describa los problemas que tiene en detalle para que podamos ayudarlo mejor.</span></p>
<p dir="ltr"><span>Para usar TrackView, debe instalar e iniciar sesión en TrackView usando la misma cuenta de Gmail en múltiples dispositivos para que pueda rastrear y monitorear entre sí. Indique también un nombre de dispositivo único para cada dispositivo (el nombre del dispositivo debe tener menos de 7 caracteres) para que pueda distinguir estos dispositivos. Además, encienda la función de GPS en el dispositivo de destino para obtener información de ubicación precisa.</span></p>
<p dir="ltr"><span>Visite los siguientes sitios web para obtener información más detallada sobre cómo usar TrackView.</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><a href="https://www.youtube.com/watch?v=vJdxiONZAOA"><span>Video de demostración:</span></a><span>: Cómo usar TrackView</span></p>
<p dir="ltr"><a href="http://trackview.net/manual.html"><span>Documentación en línea</span></a><span>: Instrucciones paso a paso</span></p>
<p dir="ltr"><a href="http://trackview.net/faq.html"><span>Preguntas frecuentes en línea</span></a><span>: Más preguntas y respuestas</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><span>Atentamente,</span></p>
<p dir="ltr"><span>Equipo de soporte de TrackView</span></p>`

var autoReplyEmailTR = `<p dir="ltr"><span>Sevgili TrackView kullanıcısı,</span></p>
<p dir="ltr"><span>Bizimle iletişime geçtiğiniz için teşekkürler. Size yardımcı olabilecek herhangi bir sorun var mı? Lütfen size daha iyi yardımcı olabilmemiz için, sahip olduğunuz sorunları ayrıntılı olarak açıklayın.</span></p>
<p dir="ltr"><span>TrackView'i kullanmak için, birbirini izleyip izleyebilmeniz için birden fazla cihazda aynı Gmail hesabını kullanarak TrackView'i kurmanız ve oturum açmanız gerekir. Ayrıca, bu cihazları ayırt edebilmeniz için lütfen her bir cihaza benzersiz bir cihaz adı verin (cihazın adı 7 karakterden az olmalıdır). Ayrıca, doğru konum bilgilerini almak için lütfen hedef cihazdaki GPS özelliğini açın.</span></p>
<p dir="ltr"><span>TrackView kullanımıyla ilgili daha ayrıntılı bilgi için lütfen aşağıdaki web sitelerini ziyaret edin.</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><a href="https://www.youtube.com/watch?v=vJdxiONZAOA"><span>Demo Video:</span></a><span>: TrackView nasıl kullanılır?
</span></p>
<p dir="ltr"><a href="http://trackview.net/manual.html"><span>Çevrimiçi belgeler</span></a><span>: Adım adım talimatlar</span></p>
<p dir="ltr"><a href="http://trackview.net/faq.html"><span>Online SSS</span></a><span>: Diğer sorular ve cevaplar</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><span>Saygılarımla,</span></p>
<p dir="ltr"><span>TrackView Destek Ekibi</span></p>`

var autoReplyEmailPT = `<p dir="ltr"><span>Caro usuário do TrackView,</span></p>
<p dir="ltr"><span>Obrigado por nos contatar. Existem problemas com os quais podemos ajudá-lo? Por favor, descreva os problemas que você tem em detalhes para que possamos ajudá-lo melhor.</span></p>
<p dir="ltr"><span>Para usar o TrackView, você deve instalar e fazer login no TrackView usando a mesma conta do Gmail em vários dispositivos para que você possa acompanhar e monitorar uns aos outros. Digite também um nome de dispositivo único para cada dispositivo (o nome do dispositivo deve ter menos de 7 caracteres) para que você possa distinguir esses dispositivos. Além disso, ative o recurso de GPS no dispositivo de destino para obter informações de localização precisas.</span></p>
<p dir="ltr"><span>Visite os seguintes sites para obter informações mais detalhadas sobre como usar o TrackView.</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><a href="https://www.youtube.com/watch?v=vJdxiONZAOA"><span>Demo Video:</span></a><span>: Como usar o TrackView</span></p>
<p dir="ltr"><a href="http://trackview.net/manual.html"><span>Documentação on-line</span></a><span>: Instruções passo-a-passo</span></p>
<p dir="ltr"><a href="http://trackview.net/faq.html"><span>Perguntas frequentes on-line</span></a><span>: Mais perguntas e respostas</span></p>
<p dir="ltr"><span>+++++++++++++++++++++++++++++++++++++++++++</span></p>
<p dir="ltr"><span>Cumprimentos,</span></p>
<p dir="ltr"><span>Equipe de suporte TrackView</span></p>`

var templates = [
  autoReplyEmailEN,
  autoReplyEmailES,
  autoReplyEmailTR,
  autoReplyEmailPT
]

class GmailHelper {

  constructor(oauth2Client, labels) {
    this.oauth2Client = oauth2Client
    this.pjLabels = labels
    this.sendDraft = this.sendDraft.bind(this);
    this.createDraft = this.createDraft.bind(this);
    this.removeLabels = this.removeLabels.bind(this);
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
    if (b64string == undefined) {
      return ''
    }
    let buf = new Buffer(b64string, 'base64');
    return buf.toString('utf8')
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

  sendDraft(draftId, callback) {
    var data = {'id': draftId }

    var draftIdd = draftId

    var self = this;
    var cb = callback;
    gmail.users.drafts.send({
      userId: 'me',
      auth: this.oauth2Client,
      resource: data
    }, function (err, data) {
      if (err) {
        console.log('Wait to retry send: ' + draftIdd)
        setTimeout(function () { self.sendDraft(draftIdd, cb)  }, 1000)
        return
      }
      console.log('drafted sent as: ' + data.id)
      cb(data.threadId)
    })
  }

  createDraft(threadId, to, subject, templateIndex, callback) {

    var threadIdd = threadId
    var too = to
    var subjectt  = subject
    var templateIndexx = templateIndex

    if (templateIndex < 0 || templateIndex >= templates.length) {
      //ERROR: no supporting template
      console.log('no template found for this email')
      return
    }

    var template = templates[templateIndex]
    var raw = this.createRawHTML(to, subject, template)

    var data = {'message': { 'raw': raw, 'threadId': threadId } };

    var self = this;
    var cb = callback;
    gmail.users.drafts.create({
      userId: 'me',
      auth: this.oauth2Client,
      resource: data
    },
    function (err, data) {
      if (err) {
        console.log('Wait to retry create draft: ' + threadId)
        setTimeout(function () { self.createDraft(threadIdd, too, subjectt, templateIndexx, cb) } , 1000)
        return
      }
      console.log('drafted created')
      cb(data.id)
    })
  }
  //labels = array ["INBOX", "UNREAD"]
  removeLabels(threadId, labels) {
    var threadIdd = threadId
    var labelss = labels

    var data = { 'removeLabelIds': labels, 'addLabelIds': this.pjLabels }
    var pjLabels = this.pjLabels

    var self = this
    gmail.users.threads.modify({
      userId: 'me',
      auth: this.oauth2Client,
      id: threadId,
      resource: data
    },
    function (err, data) {
      if (err) {
        console.log('Wait to retry labels: ' + threadIdd)
        setTimeout(function () { self.removeLabels(threadIdd, labelss) }, 1000)
        return
      }
      console.log('thread archived + read +' + pjLabels)
    })
  }

}

export default GmailHelper
