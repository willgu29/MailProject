
//See: http://www.lingoes.net/en/translator/langcode.htm

var languageCodes = {
  'un_un': 'UNKNOWN',
  'af': 'AFRIKAANS',
  'ar': 'ARABIC',
  'be': 'BELARUSIAN',
  'bg': 'BULGARIAN',
  'cs': 'CZECH',
  'cy': 'WELSH',
  'da': 'DANISH',
  'de': 'GERMAN',
  'el': 'GREEK',
  'en': 'ENGLISH',
  'es': 'SPANISH',
  'et': 'ESTONIAN',
  'eu': 'BASQUE',
  'fa': 'FARSI',
  'fi': 'FINNISH',
  'fr': 'FRENCH',
  'he': 'HEBREW',
  'hi': 'HINDI',
  'hr': 'CROATIAN',
  'hu': 'HUNGARIAN',
  'hy': 'ARMENIAN',
  'id': 'INDONESIAN',
  'it': 'ITALIAN',
  'ja': 'JAPANESE',
  'ka': 'GEORGIAN',
  'ko': 'KOREAN',
  'lv': 'LATVIAN',
  'mn': 'MONGOLIAN',
  'ms': 'MALAY',
  'nl': 'DUTCH',
  'pa': 'PUNJABI',
  'pt': 'PORTUGUESE',
  'ro': 'ROMANIAN',
  'ru': 'RUSSIAN',
  'sk': 'SLOVAK',
  'sl': 'SLOVENIAN',
  'sq': 'ALBANIAN',
  'sv': 'SWEDISH',
  'th': 'THAI',
  'tr': 'TURKISH',
  'uk': 'UKRAINIAN',
  'vi': 'VIETNAMESE',
  'zh': 'CHINESE'
}

/*
var languageCodes = {
  'un_un': 'UNKNOWN',
  'ar_EG': 'ARABIC',
  'ar_AE': 'ARABIC',
  'ar_YE': 'ARABIC',
  'az_DZ': 'AZERI',
  'tr_TR': 'TURKISH',
  'fr_FR': 'FRENCH',
  'fr_US': 'FRENCH',
  'de_DE': 'GERMAN',
  'en_GB': 'ENGLISH',
  'es_ES': 'SPANISH',
  'pt_BR': 'PORTUGUESE',
  'uk_UA': 'UKRAINIAN',
  'ru_RU': 'RUSSIAN',
  'th_KH': 'THAI',
  'vi-VN': 'VIETNAMESE'
}
*/


class TemplatePicker {

  //un_un == unknown
  //
  parseLanguage(subject) {
    //looks like llanguagecodesl
    var regex = /[l\[]\w\w[\w-]\w\w[l\]]/g;
    var match = subject.match(regex)
    if (match == null) {
      return languageCodes['un_un']
    }
    //2 alpha ISO
    var code = match[0].slice(1, -1).slice(0, 2)
    var language = languageCodes[code]
    return language
  }

  parseSupport(subject) {
    //gets lplanl lissuel+ Support for <blank or otherwise>
    var regex = /(l...l\s)?(l..?l\s)+Support for.*/g;
    var match = subject.match(regex)
    if (match == null) {
      return false
    }
    return true
  }

  parseEmpty(text) {
    if (text.trim() == '') {
      return true
    }
    //match email
    var regex = /[\w|\d]+@.+\.\w{2,5}/g;
    var match = regex.exec(text)
    if (match == null) { return false }
    //email is first thing and close to only thing in body
    if (match.index < 15) {
      return true
    } else {
      return false
    }
  }
  parsePaypal(subject) {
    var regex = /Notification of payment received/g;
    var match = regex.exec(subject)
    if (match == null) { return false }
    return true
  }

  checkEnglish(text) {
    //number or any other character will result in null
    var regex = /^[a-zA-Z]+$/g;
    var match = text.match(regex)
    if (match == null) {
      return false
    }
    return true
  }

  parseRe(subject) {
      var regex = /Re:/g;
      var match = subject.match(regex)
      if (match == null) { return false }
      return true
  }

  parseIOS(subject) {
    var regex = /\[iOS\]/g;
    var match = subject.match(regex)
    if (match == null) { return false }
    return true
  }

}

export default TemplatePicker
