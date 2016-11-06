import Model from "../src/model"
import assert from "power-assert"
import Redis from "redis"

console.log("=*=*=*=*=*=*=*= TEST =*=*=*=*=*=*=*=")

const redis = Redis.createClient();

describe("Model", () => {
  const config = {
    client : redis,
    namespace : "redischema-test"
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
        return instance.save()
          .then(() => {
            assert(instance.params.id !== undefined);
          })
      });
    });
  });

  describe("#find", () => { 
    const params = { param1 : "foo", param2 : "bar" };
    const instance = TestModel.make(params);
    let promise = instance.save();

    it("find an instance by id", () => {
      promise = promise.then(() => {
        return TestModel.find(instance.params.id);
      })
      .then((foundInstance) => {
        assert.deepEqual(foundInstance.params, instance.params);
      })
      return promise;
    });
    
    it("find an instance by specific param", () => {
      promise = promise.then(() => {
        return TestModel.findBy("param1", params.param1);
      })
      .then((foundInstance) => {
        assert(foundInstance.params.param1 === params.param1);
      })
      return promise;
    });

    it("find all instance", () => {
      promise = promise.then(() => {
        return TestModel.all();
      })
      .then((foundInstances) => {
        assert(foundInstances);
      })
      return promise;
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
      return promise;
    });
 
    it("find all instance by custom condition", () => {
      promise = promise.then(() => {
        return TestModel.where((instanceParams) => {
          return instanceParams.param1 === params.param1
        });
      })
      .then((foundInstances) => {
        const isFound = foundInstances.reduce((acc, foundInstance) => {
          return acc && foundInstance.params.param1 === params.param1;
        }, true);
        assert(isFound);
      })
      return promise;
    });

  });

  describe("case of no instance in the namespace", () => {
    const EmptyTestModel = new Model({
      client : redis,
      namespace : "redischema-noinstance-test"
    });
 
    it("Model.find returns null", () => {
      return EmptyTestModel.find(1)
      .then((response) => {
        assert.equal(response, null);
      });
    });

    it("Model.all returns null", () => {
      return EmptyTestModel.all().then((response) => {
        assert.equal(response, null);
      });
    });
  });

  after(() => {
    console.log("\n\nClearning test environment...");
    return redis.keysAsync("*redischema-test*")
    .then((keys) => {
      return redis.delAsync(keys);
    })
    .then(() => { console.log("...done"); })
  });
});
