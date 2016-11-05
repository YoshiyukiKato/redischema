import Promise from "bluebird"
import pluralize from "pluralize"

export default class Model{
  /**@param { 
   *  client: string, 
   *  db : string,
   *  schema : { typeName : {} },
   *  relations : { hasMany : [Model] , belongsTo : [Model] }
   * } config
  */  
  constructor(config){
    this.client = config.client;
    this.db = config.db;
    this.table = config.table;
    this.config = config;
  }

  make(params){
    const instance = new Instance(this.config, params);
    return instance;
  }
  
  find(id) {
    const promise = this.client.hgetAsync(`${this.db}:${this.table}`, id)
      .then((paramsJSON) => {
        if (paramsJSON) return new Instance(this.config, JSON.parse(paramsJSON));
        return null;
      });
    return promise;
  }

  findBy(column, value){
    const promise = this.client.hgetallAsync(`${this.db}:${this.table}`)
      .then((hashMap) => {
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

  where(condition){
    const promise = this.client.hgetallAsync(`${this.db}:${this.table}`)
      .then((hashMap) => {
        const ids = Object.keys(hashMap);
        const instances = [];
        let id, params, instance;
        for(let i=0; i<ids.length; i++){
          id = ids[i];
          params = JSON.parse(hashMap[id]);
          if(condition(params)){
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
    this.db = config.db;
    this.table = config.table;
    if(config.schema) this._setSchema(config.schema);
    if(config.relations) this._setRelations(config.relations);
 
    this.params = params || {}; 
  }

  _setSchema(schema={}){}

  _setRelations(relations={}){
    if(!!relations.hasMany) this.setHasMany(relations.hasMany);
    if(!!relations.belongsTo) this.setBelongsTo(relations.belongsTo);
  }

  _setHasMany(ChildList){
    ChildList.forEach((Child) => {
      const childrenKey = pluralize.plural(Child.table); 
      this[childrenKey] = this._findChildren.bind(this, Child);
    });
  }

  _setBelongsTo(ParentList){
    ParentList.forEach((Parent) => {
      const parentKey = Parent.table;
      this[parentKey] = this._findParent.bind(this, Parent);
    });
  }

  _findChildren(Child){
    const column = `${this.table}_id`;
    const value = this.params.id;
    const promise = Child.findAllBy(column, value)
    return promise;
  }

  _findParent(Parent){
    const column = `${Parent.table}_id`;
    const promise = Parent.find(this.params[column]);
    return promise;
  }

  setParams(paramsChange={}){
    this.params = Object.assign(this.params, paramsChange);
    return this;
  }

  save(){
    let promise;
    //TODO: validate params by schema
    if(this.params.id && this.params){
      promise = this.client.hsetAsync(`${this.db}:${this.table}`, this.params.id, this.params)
    }else if(this.params){
      promise = this.client.incrAsync(`count@${this.db}:${this.table}`)
        .then((id) => {
          this.setParams({ id : id });
          return this.client.hsetAsync(`${this.db}:${this.table}`, this.params.id, JSON.stringify(this.params));
        })
    }else{
      promise = Promise.reject("params is not defined");
    }
    return promise;
  }
}