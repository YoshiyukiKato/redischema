"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Types = {
  Number: validateNumber,
  String: validateString,
  Boolean: validateBoolean,
  Array: validateArray,
  Object: validateObject,
  Enum: validateEnum,
  Function: validateFunction
};

function validateCommonConstraint(value) {
  var constraint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((value === null || value === undefined) && constraint.defaultTo) value = constraint.defaultTo;
  if ((value === null || value === undefined) && constraint.notNull) throw new Error('[TypeValidator] Null is not allowed.');
  return value; //return allowed null or undefined
}

function validateNumber() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (value) {
    value = validateCommonConstraint(value, constraint);
    if (value === null || value === undefined) return value;
    if (typeof value !== "number") throw new Error("[TypeValidator] Number is expected but " + (typeof value === "undefined" ? "undefined" : _typeof(value)) + " was given.");

    if (constraint.biggerThan && value < constraint.biggerThan) throw new Error('[TypeValidator] Too small number.');
    if (constraint.smallerThan && value > constraint.smallerThan) throw new Error('[TypeValidator] Too big number.');
    return value;
  };
}

function validateString() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (value) {
    value = validateCommonConstraint(value, constraint);
    if (value === null || value === undefined) return value;
    if (typeof value !== "string") throw new Error("[TypeValidator] String is expected but " + (typeof value === "undefined" ? "undefined" : _typeof(value)) + " was given.");
    if (constraint.longerThan && value.length < constraint.longerThan) throw new Error('[TypeValidator] Too short strings.');
    if (constraint.shorterThan && value.length > constraint.shorterThan) throw new Error('[TypeValidator] Too long strings.');
    return value;
  };
}

function validateBoolean() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (value) {
    value = validateCommonConstraint(value, constraint);
    if (value === null || value === undefined) return value;
    if (typeof value !== "boolean") throw new Error("[TypeValidator] Boolean is expected but " + (typeof value === "undefined" ? "undefined" : _typeof(value)) + " was given.");
    return value;
  };
}

function validateArray() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (value) {
    value = validateCommonConstraint(value, constraint);
    if (value === null || value === undefined) return value;
    if (!Array.isArray(value)) throw new Error("[TypeValidator] Array is expected but " + (typeof value === "undefined" ? "undefined" : _typeof(value)) + " was given.");
    if (constraint.longerThan && value.length < constraint.longerThan) throw new Error('[TypeValidator] Too short array.');
    if (constraint.shorterThan && value.length > constraint.shorterThan) throw new Error('[TypeValidator] Too long array.');
    if (constraint.itemSchema) {
      value = value.map(function (item) {
        return validate(constraint.itemSchema, item);
      });
    }
    return value;
  };
}

function validateObject() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (value) {
    value = validateCommonConstraint(value, constraint);
    if (value === null || value === undefined) return value;
    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") throw new Error("[TypeValidator] Object is expected but " + (typeof value === "undefined" ? "undefined" : _typeof(value)) + " was given.");
    if (constraint.schema) {
      value = validate(constraint.schema, value); //call validate function with the value and its schema
    }
    return value;
  };
}

function validateEnum() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!constraint.values) throw new Error("[TypeValidator] No `values` constraint was given in Enum schema.");
  return function (value) {
    value = validateCommonConstraint(value, constraint);

    var result = constraint.values.reduce(function (acc, cValue) {
      return acc || compare(value, cValue);
    }, false);

    if (!result) throw new Error("[TypeValidator] Unexpected enum value");
    return value;
  };
}

function compare(value1, value2) {
  return JSON.stringify({ value: value1 }) === JSON.stringify({ value: value2 });
}

function validateFunction() {
  var constraint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (value) {
    value = validateCommonConstraint(value, constraint);
    if (value === null || value === undefined) return value;
    if (typeof value !== "function") throw new Error("[TypeValidator] Unexpected enum value");
    return value;
  };
}

//validation interface
function validate(dataSchema, data) {
  var validated = {};
  Object.keys(dataSchema).map(function (key) {
    var validator = dataSchema[key];
    var target = data[key];
    validated[key] = validator(target);
  });
  return Object.assign(data, validated);
}

function validateAsync(dataSchema, data) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(validate(dataSchema, data));
    } catch (e) {
      reject(e);
    }
  });
}

exports.default = { Types: Types, validate: validate, validateAsync: validateAsync };
module.exports = exports["default"];