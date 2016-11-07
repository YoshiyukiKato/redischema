const Types = {
  Number: validateNumber,
  String: validateString,
  Boolean: validateBoolean,
  Array: validateArray,
  Object: validateObject,
  Enum: validateEnum,
  Function: validateFunction
}

function validateCommonConstraint(value, constraint={}){
  if((value === null || value === undefined) && constraint.defaultTo) value = constraint.defaultTo;
  if((value === null || value === undefined) && constraint.notNull) throw new Error('[TypeValidator] Null is not allowed.');
  return value; //return allowed null or undefined
}

function validateNumber(constraint={}){
  return function(value){
    value = validateCommonConstraint(value, constraint);
    if(value === null || value === undefined) return value;
    if(typeof value !== "number") throw new Error("[TypeValidator] Number is expected but " + (typeof value) + " was given.");

    if(constraint.biggerThan && value < constraint.biggerThan) throw new Error('[TypeValidator] Too small number.');
    if(constraint.smallerThan && value > constraint.smallerThan) throw new Error('[TypeValidator] Too big number.');
    return value;
  }
}

function validateString(constraint={}){
  return function(value){
    value = validateCommonConstraint(value, constraint);
    if(value === null || value === undefined) return value;
    if(typeof value !== "string") throw new Error("[TypeValidator] String is expected but " + (typeof value) + " was given.");
    if(constraint.longerThan && value.length < constraint.longerThan) throw new Error('[TypeValidator] Too short strings.');
    if(constraint.shorterThan && value.length > constraint.shorterThan) throw new Error('[TypeValidator] Too long strings.');
    return value;
  }
}

function validateBoolean(constraint={}){
  return function(value){
    value = validateCommonConstraint(value, constraint);
    if(value === null || value === undefined) return value;
    if(typeof value !== "boolean") throw new Error("[TypeValidator] Boolean is expected but " + (typeof value) + " was given.");
    return value;
  }
}

function validateArray(constraint={}){
  return function(value){
    value = validateCommonConstraint(value, constraint);
    if(value === null || value === undefined) return value;
    if(!Array.isArray(value)) throw new Error("[TypeValidator] Array is expected but " + (typeof value) + " was given.");
    if(constraint.longerThan && value.length < constraint.longerThan) throw new Error('[TypeValidator] Too short array.');
    if(constraint.shorterThan && value.length > constraint.shorterThan) throw new Error('[TypeValidator] Too long array.');
    if(constraint.itemSchema){
      value = value.map((item) => {
        return validate(constraint.itemSchema, item);
      }); 
    }
    return value;
  }
}

function validateObject(constraint={}){
  return function(value){
    value = validateCommonConstraint(value, constraint);
    if(value === null || value === undefined) return value;
    if(typeof value !== "object") throw new Error("[TypeValidator] Object is expected but " + (typeof value) + " was given.");
    if(constraint.schema){
      value = validate(constraint.schema, value); //call validate function with the value and its schema
    }
    return value;
  }
}

function validateEnum(constraint={}){
  if(!constraint.values) throw new Error("[TypeValidator] No `values` constraint was given in Enum schema.");
  return function(value){
    value = validateCommonConstraint(value, constraint);
    
    let result = constraint.values.reduce((acc, cValue) => {
      return acc || compare(value, cValue);
    }, false);
    
    if(!result) throw new Error("[TypeValidator] Unexpected enum value"); 
    return value;
  }
}

function compare(value1, value2){
  return JSON.stringify({ value: value1 }) === JSON.stringify({ value: value2 });
}

function validateFunction(constraint={}){
  return function(value){
    value = validateCommonConstraint(value, constraint);
    if(value === null || value === undefined) return value;
    if(typeof value !== "function") throw new Error("[TypeValidator] Unexpected enum value"); 
    return value;
  }
}

//validation interface
function validate(dataSchema, data){
  let validated = {};
  Object.keys(dataSchema).map((key) => {
    let validator = dataSchema[key];
    let target = data[key];
    validated[key] = validator(target);
  });
  return Object.assign(data, validated);
}

function validateAsync(dataSchema, data){
  return new Promise((resolve, reject) => {
    try{
      resolve(validate(dataSchema, data));
    }catch(e){
      reject(e);
    }
  });
}

export default { Types, validate, validateAsync }