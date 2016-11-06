"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _pluralize = require("pluralize");

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  /**@param { 
   *  client: RedisClient,
   *  namespace : string, 
   *  paramTypes : { paramName : TypeValidator({constraints}) }, //TODO
   *  relations : { hasMany : [Model] , belongsTo : [Model] }
   * } config
  */

  function Model(config) {
    _classCallCheck(this, Model);

    this.client = _bluebird2.default.promisifyAll(config.client);
    this.namespace = config.namespace;
    this.config = config;
  }

  _createClass(Model, [{
    key: "make",
    value: function make(params) {
      var instance = new Instance(this.config, params);
      return instance;
    }
  }, {
    key: "find",
    value: function find(id) {
      var _this = this;

      var promise = this.client.hgetAsync(this.namespace, id).then(function (paramsJSON) {
        if (paramsJSON) return new Instance(_this.config, JSON.parse(paramsJSON));
        return null;
      });
      return promise;
    }
  }, {
    key: "findBy",
    value: function findBy(column, value) {
      var _this2 = this;

      var promise = this.client.hgetallAsync(this.namespace).then(function (hashMap) {
        if (!hashMap) return null;
        var ids = Object.keys(hashMap);
        var id = void 0,
            params = void 0;
        for (var i = 0; i < ids.length; i++) {
          id = ids[i];
          params = JSON.parse(hashMap[id]);
          if (params[column] === value) return new Instance(_this2.config, params);
        }
      });
      return promise;
    }
  }, {
    key: "findAllBy",
    value: function findAllBy(column, value) {
      var condition = function (column, value, params) {
        return params[column] === value;
      }.bind(this, column, value);
      var promise = this.where(condition);
      return promise;
    }
  }, {
    key: "all",
    value: function all() {
      return this.where();
    }
  }, {
    key: "where",
    value: function where(condition) {
      var _this3 = this;

      var promise = this.client.hgetallAsync(this.namespace).then(function (hashMap) {
        if (!hashMap) return null;
        var instances = [];
        var ids = Object.keys(hashMap);
        var id = void 0,
            params = void 0,
            instance = void 0,
            isTarget = void 0;
        for (var i = 0; i < ids.length; i++) {
          id = ids[i];
          params = JSON.parse(hashMap[id]);
          isTarget = !!condition ? condition(params) : true;
          if (isTarget) {
            instance = new Instance(_this3.config, params);
            instances.push(instance);
          }
        }
        return instances;
      });
      return promise;
    }
  }]);

  return Model;
}();

exports.default = Model;

var Instance = function () {
  function Instance(config, params) {
    _classCallCheck(this, Instance);

    this.client = config.client;
    this.namespace = config.namespace;
    if (!!config.paramTypes) this._setTypeValidator(config.paramTypes);
    if (!!config.relations) this._setRelations(config.relations);

    this.params = params || {};
  }

  _createClass(Instance, [{
    key: "_setTypeValidator",
    value: function _setTypeValidator() {
      var paramTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    }
  }, {
    key: "_setRelations",
    value: function _setRelations() {
      var relations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!!relations.hasMany) this.setHasMany(relations.hasMany);
      if (!!relations.belongsTo) this.setBelongsTo(relations.belongsTo);
    }
  }, {
    key: "_setHasMany",
    value: function _setHasMany(ChildList) {
      var _this4 = this;

      ChildList.forEach(function (Child) {
        var childrenKey = _pluralize2.default.plural(Child.namespace);
        _this4[childrenKey] = _this4._findChildren.bind(_this4, Child);
      });
    }
  }, {
    key: "_setBelongsTo",
    value: function _setBelongsTo(ParentList) {
      var _this5 = this;

      ParentList.forEach(function (Parent) {
        var parentKey = Parent.namespace;
        _this5[parentKey] = _this5._findParent.bind(_this5, Parent);
      });
    }
  }, {
    key: "_findChildren",
    value: function _findChildren(Child) {
      var column = this.namespace + "_id";
      var value = this.params.id;
      var promise = Child.findAllBy(column, value);
      return promise;
    }
  }, {
    key: "_findParent",
    value: function _findParent(Parent) {
      var column = Parent.namespace + "_id";
      var promise = Parent.find(this.params[column]);
      return promise;
    }
  }, {
    key: "setParams",
    value: function setParams() {
      var paramsChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.params = Object.assign(this.params, paramsChange);
      return this;
    }
  }, {
    key: "save",
    value: function save() {
      var _this6 = this;

      var promise = void 0;
      //TODO: validate params
      if (this.params.id && this.params) {
        promise = this.client.hsetAsync(this.namespace, this.params.id, JSON.stringify(this.params));
      } else if (this.params) {
        promise = this.client.incrAsync("index@" + this.namespace).then(function (id) {
          _this6.setParams({ id: id });
          return _this6.client.hsetAsync(_this6.namespace, _this6.params.id, JSON.stringify(_this6.params));
        });
      } else {
        promise = _bluebird2.default.reject("params is not defined");
      }
      return promise;
    }
  }]);

  return Instance;
}();

module.exports = exports["default"];