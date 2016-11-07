import Promise from "bluebird"
import pluralize from "pluralize"
import { validateAsync } from "./param"

export default class Model{
  /**@param { 
   *  client: RedisClient,
   *  namespace : string, 
   *  paramTypes : { paramName : TypeValidator({constraints}) }, //TODO
   *  relations : { hasMany : [Model] , belongsTo : [Model] }
   * } config
  */  

  constructor(config){
    this.client = Promise.promisifyAll(config.client);
    this.namespace = config.namespace;
    this.config = config;
  }

  make(params){
    const instance = new Instance(this.config, params);
    return instance;
  }
  
  find(id) {
    const promise = this.client.hgetAsync(this.namespace, id)
      .then((paramsJSON) => {
        if (paramsJSON) return new Instance(this.config, JSON.parse(paramsJSON));
        return null;
      });
    return promise;
  }

  findBy(column, value){
    const promise = this.client.hgetallAsync(this.namespace)
      .then((hashMap) => {
        if(!hashMap) return null;
        const ids = Object.keys(hashMap);
        let id, params;
        for(let i=0; i<ids.length; i++){
          id = ids[i];
          params = JSON.parse(hashMap[id]);
          if(params[column] === value) return new Instance(this.config, params);
        }
      });
    return promise;
  }
 
  findAllBy(column, value){
    const condition = function(column, value, params){
      return params[column] === value;
    }.bind(this, column, value);
    const promise = this.where(condition);
    return promise;
  }

  all(){
    return this.where();
  }

  where(condition){
    const promise = this.client.hgetallAsync(this.namespace)
      .then((hashMap) => {
        if(!hashMap) return null;
        const instances = [];
        const ids = Object.keys(hashMap);
        let id, params, instance, isTarget;
        for(let i=0; i<ids.length; i++){
          id = ids[i];
          params = JSON.parse(hashMap[id]);
          isTarget = !!condition ? condition(params) : true;
          if(isTarget){
            instance = new Instance(this.config, params);
            instances.push(instance);
          }
        }
        return instances;
      });
    return promise;
  }
}


class Instance{
  constructor(config, params){
    this.client = config.client;
    this.namespace = config.namespace;
    this.setParamTypes(config.paramTypes);
    this.setRelations(config.relations);
    this.params = params || {};
  }

  setParamTypes(paramTypes={}){
    this.paramTypes = this.paramTypes ? Obejct.assign(this.paramTypes, paramTypes) : paramTypes;
    this.validateParams= validateAsync.bind(this, this.paramTypes);
    return this;
  }

  setRelations(relations={}){
    if(!!relations.hasMany) this.setHasMany(relations.hasMany);
    if(!!relations.belongsTo) this.setBelongsTo(relations.belongsTo);
    return this;
  }

  _setHasMany(ChildList){
    ChildList.forEach((Child) => {
      const childrenKey = pluralize.plural(Child.namespace); 
      this[childrenKey] = this._findChildren.bind(this, Child);
    });
  }

  _setBelongsTo(ParentList){
    ParentList.forEach((Parent) => {
      const parentKey = Parent.namespace;
      this[parentKey] = this._findParent.bind(this, Parent);
    });
  }

  _findChildren(Child){
    const column = `${this.namespace}_id`;
    const value = this.params.id;
    const promise = Child.findAllBy(column, value)
    return promise;
  }

  _findParent(Parent){
    const column = `${Parent.namespace}_id`;
    const promise = Parent.find(this.params[column]);
    return promise;
  }

  setParams(paramsChange={}){
    this.params = Object.assign(this.params, paramsChange);
    return this;
  }

  _initId(){
    return this.client.incrAsync(`index@${this.namespace}`)
      .then((id) => {
        this.setParams({ id: id });
        return this;
      });
  }

  save(){
    return this.validateParams(this.params)
      .then((params) => {
        this.params = params; //overwrite
        if(!params.id) return this._initId();
        else return this;
      })
      .then(() => {
        return this.client.hsetAsync(this.namespace, this.params.id, JSON.stringify(this.params));
      });
  }
}