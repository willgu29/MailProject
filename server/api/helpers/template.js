

class TemplatePicker {

  parseSubject(subject) {
    //gets lplanl lissuel+ Support for <blank or otherwise>
    var regex = /(l...l\s)?(l..?l\s)+Support for.*/g;
    var match = subject.match(regex)
    if (match == null) {
      return false
    }
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


}

export default TemplatePicker
