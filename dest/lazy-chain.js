"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LazyChain = function () {
  function LazyChain() {
    _classCallCheck(this, LazyChain);

    this.state = {};
  }

  _createClass(LazyChain, [{
    key: "setState",
    value: function setState(change) {
      this.state = Object.assign(this.state, change);
    }
  }, {
    key: "then",
    value: function then(cb) {
      var promise = this.promise;
      this.promise = null;
      return promise.then(cb);
    }
  }, {
    key: "next",
    value: function next(promise) {
      if (!!this.promise) {
        this.promise = this.promise.then(function (promise) {
          return promise;
        }.bind(this, promise));
      } else {
        this.promise = promise;
      }
      return this;
    }
  }]);

  return LazyChain;
}();

exports.default = LazyChain;
module.exports = exports["default"];