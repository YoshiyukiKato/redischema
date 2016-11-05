import Model from "../src/model"
import assert from "power-assert"
import Promise from "bluebird"
import Redis from "redis"

const redis = Promise.promisifyAll(Redis.createClient());
console.log("=*=*=*=*=*=*=*= TEST =*=*=*=*=*=*=*=")

describe("Model", () => {
  const config = {
    client : redis,
    db : "redorm-test",
    table : "test"
  };
  const TestModel = new Model(config);
 
  describe("#make", () => {
    it("makes a new instance", () => {
      const params = { param1 : "foo", param2 : "bar" };
      const instance = TestModel.make(params);
      assert.deepEqual(instance.params, params);
    });

    describe("Instance", () => {
      it("update params of an instance", () => {
        const params = { param1 : "foo", param2 : "bar" };
        const paramsUpdate = { param2 : "boo", param3 : "baz" }
        const instance = TestModel.make(params).setParams(paramsUpdate);
        assert.deepEqual(instance.params, { param1 : "foo", param2 : "boo", param3 : "baz" });
      });

      it("save params of an instance", () => {
        const params = { param1 : "foo", param2 : "bar" };
        const instance = TestModel.make(params);
        instance.save()
          .then(() => {
            assert(instance.params.id !== undefined);
          });
      });
    });
  });

  describe("#find", () => {
    const params = { param1 : "foo", param2 : "bar" };
    const instance = TestModel.make(params);
    let promise = instance.save();
      
    it("find instance by id", () => {
      promise = promise.then(() => {
        return TestModel.find(instance.params.id);
      })
      .then((foundInstance) => {
        assert.deepEqual(foundInstance.params, instance.params);
      })
    });
    
    it("find an instance by specific param", () => {
      promise = promise.then(() => {
        return TestModel.findBy("param1", params.param1);
      })
      .then((foundInstance) => {
        assert(foundInstance.params.param1 === params.param1);
      })
    });

    it("find all instance by specific param", () => {
      promise = promise.then(() => {
        return TestModel.findAllBy("param1", params.param1);
      })
      .then((foundInstances) => {
        const isFound = foundInstances.reduce((acc, foundInstance) => {
          return acc && foundInstance.params.param1 === params.param1;
        }, true);
        assert(isFound);
      });
    });
  });

  after(() => {
    console.log("\n\nClearning test environment...");
    return redis.keysAsync("*redorm-test*")
    .then((keys) => {
      return redis.delAsync(keys);
    })
    .then(() => { console.log("...done"); });
  });
});
