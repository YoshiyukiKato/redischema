import Promise from "bluebird"

export default class Redorm{
  constructor(redisClient){
    this.client = redisClient;
  }
}