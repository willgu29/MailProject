var _img = document.getElementById('tracking')
var newImg = new Image()
newImg.onload = function () {
  _img.src = this.src
}
newImg.src = 'https://www.penguinjeffrey.com/public/assets/info.png'
