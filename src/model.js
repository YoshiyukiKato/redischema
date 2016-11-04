import pluralize from "pluralize"

//instance.children -> Child.get({ instance_id : instance.id })
//User.find(id)
//User.findByHoge(hoge);
//Modelにパラメータを渡すとインスタンスが出る

//let par = Parent.find(parId);
//par.children


class Model{
  constructor(config){
    this.db = config.db;
    this.table = config.table;
    this.client = config.client;
    this.promises = null;
  }

  then(cb){
    const promise = this.promise;
    this.promise = null;
    return promise.then(cb);
  }

  next(promise){
    this.promise.then(function(promise){ this.promise = promise; }.bind(this, promise));
    return this;
  }

  find(id){
    const promise = this.client.hgetAsync(`${this.db}:${this.table}`, id)
      .then((data) => {
        if(data){
          this.id = id;
          this.data = data;
        }
        return this;
      })
    return this.next(promise);
  }
  
  get(){
    const promise = Promise.resolve(this.data);
    return this.next(promise);
  }

  set(data){
    const promise = this.client.hsetAsync(`${this.db}:${this.table}`, this.id, data);
  }

  save(){
    let promise;
    if(this.id && this.data){
      promise = this.client.hsetAsync(`${this.db}:${this.table}`, this.id, this.data)
    }else if(this.data){
      promise = this.client.incrbyAsync(`count@${this.db}:${this.table}`)
        .then((id) => {
          this.id = id;
          return this.client.hsetAsync(`${this.db}:${this.table}`, this.id, this.data)
        });
    }else{
      promise = Promise.reject("data is not defined");
    }
    return this.next(promise);
  }

  findChild(id, Child){
    const child = new Child();
    this.client.hgetAsync(`${child.db}:${child.table}_belongsTo_${this.table}`)
    .then((c2pJSON) => {
      const c2p = JSON.parse(c2pJSON);
      Object.keys(c2p).map((cid) => { 
        return c2p[cid];
      })
    })
    //childのid->parentのidというリンク
  }

  findParent(Parent){
    const parent = new Parent();
    const promise = parent.find(this.data.parentId);
    return this.next(promise);
  }
}


class ModelFactory{
  constructor(){
    
  }

  generate(config){
    const NewModel = function(params){}
    NewModel.name = config.name;
    NewModel.scheme = config.scheme;
    NewModel = this.setHasMany(NewModel, config.setHasMany);
  }

  setHasMany(model, childModels){
    childModels.forEach((childModel) => {
      const key = pluralize.plune(childModel.name);
      model[key] = childModel.find
    });
  }

  setBelongsTo(models){
    
  }
}