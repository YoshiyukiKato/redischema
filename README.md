# redischema
Simple data model for redis

```
$ npm install redischema
```

##Usage

```js
import { Model, Types } from "redischema"
import redis from "redis"

const User = new Model({
  client : redis.createClient(),
  namespace : "user",
  paramTypes : {
    name : Types.String({ notNull : true, defaultTo : "Gonbei" }),
    age : Types.Number()
  }
});

const user = User.make({ name : "Taro", age : 25 });
user.setParams({ name : "Taro Tanaka" });
user.save().then(() => {
  //id is given when a new instance saved
  console.log(user.params.id);
});
```

##TODO

* add namespace management function
 * up
 * down
 * exist
