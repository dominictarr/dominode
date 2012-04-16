var stream = require('stream')
var util = require('util')
var plates = require('plates')

function Dominode(selector, template) {
  var me = this
  stream.Stream.call(me)
  me.writable = true
  me.readable = true
  me.selector = document.querySelector(selector)
  me.template = template
}

util.inherits(Dominode, stream.Stream)

Dominode.prototype.write = function (data) {
  var compiled = plates.bind(this.template, data)
  var range = document.createRange()
  range.selectNode(document.body)
  var text = range.createContextualFragment(compiled)
  this.selector.appendChild(text)
  this.emit('data', text)
  return !!!this._paused
}

Dominode.prototpe.pause = function () {
  this._paused = true
}

Dominode.prototype.resume = function () {
  this._paused = false
  this.emit('drain')
}

Dominode.prototype.end = function () { this.emit('end') }

function dominode(selector, template) { return new Dominode(selector, template) }

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = dominode
  }
  exports = dominode
}
