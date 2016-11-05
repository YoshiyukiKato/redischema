"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Redorm = function Redorm(redisClient) {
  _classCallCheck(this, Redorm);

  this.client = redisClient;
};

exports.default = Redorm;
module.exports = exports["default"];