import { Types, validate } from "../src/param";
import * as assert from "power-assert";

describe('Param', () => {
  describe('#String', () => {
    context('without constraint', () => {
      it('accepts any string', () => {
        const data = { value: "test" };
        const dataSchema = { value: Types.String() };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('accepts null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.String() };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, dataNull);
        assert.deepEqual(resultUndefined, dataUndefined);
      });

      it('does not accept wrong type', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.String() };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with common constraint', () => {
      it('accepts any string', () => {
        const data = { value: "test" };
        const dataSchema = { value: Types.String({ notNull: true }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.String({ notNull: true }) };
        assert.throws(() => { validate(dataSchema, dataNull) });
        assert.throws(() => { validate(dataSchema, dataUndefind) });
      });

      it('accepts null or undefined when default value is given', () => {
        const defaultValue = "test";
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.String({ notNull: true, defaultTo: defaultValue }) };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, { value: defaultValue });
        assert.deepEqual(resultUndefined, { value: defaultValue });
      });

      it('returns given string rather than default values', () => {
        const data = { value: "given" };
        const dataSchema = { value: Types.String({ defaultTo: "default" }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
    });

    context('with length constraint', () => {
      it('accepts string shorter than limitsize', () => {
        const data = { value: "a" };
        const dataSchema = { value: Types.String({ shorterThan: 5 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
      it('does not accept string longer than limitsize', () => {
        const data = { value: "aaaaaa" };
        const dataSchema = { value: Types.String({ shorterThan: 5 }) };
        assert.throws(() => { validate(dataSchema, data) });
      });

      it('accepts string longer than limitsize', () => {
        const data = { value: "aaaaaa" };
        const dataSchema = { value: Types.String({ longerThan: 5 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
      it('does not accept string shorter than limitsize', () => {
        const data = { value: "a" };
        const dataSchema = { value: Types.String({ longerThan: 5 }) };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

  });

  describe('#Number', () => {
    context('without constraint', () => {
      it('accepts any number', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Number() };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('accepts null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Number() };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, dataNull);
        assert.deepEqual(resultUndefined, dataUndefined);
      });

      it('does not accept wrong type', () => {
        const data = { value: "test" };
        const dataSchema = { value: Types.Number() };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with common constraint', () => {
      it('accepts any number', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Number({ notNull: true }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Number({ notNull: true }) };
        assert.throws(() => { validate(dataSchema, dataNull) });
        assert.throws(() => { validate(dataSchema, dataUndefind) });
      });

      it('accepts null or undefined when default value is given', () => {
        const defaultValue = 1;
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Number({ notNull: true, defaultTo: defaultValue }) };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, { value: defaultValue });
        assert.deepEqual(resultUndefined, { value: defaultValue });
      });

      it('returns given number rather than default values', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Number({ defaultTo: 2 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
    });

    context('with size constraint', () => {
      it('accepts number smaller than limitsize', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Number({ smallerThan: 5 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
      it('does not accept number smaller than limitsize', () => {
        const data = { value: 6 };
        const dataSchema = { value: Types.Number({ smallerThan: 5 }) };
        assert.throws(() => { validate(dataSchema, data) });
      });

      it('accepts number longer than limitsize', () => {
        const data = { value: 6 };
        const dataSchema = { value: Types.Number({ biggerThan: 5 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
      it('does not accept number smaller than limitsize', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Number({ biggerThan: 5 }) };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });
  });

  describe('#Boolean', () => {
    context('without constraint', () => {
      it('accepts whichever boolean', () => {
        const data = { value: true };
        const dataSchema = { value: Types.Boolean() };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('accepts null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Boolean() };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, dataNull);
        assert.deepEqual(resultUndefined, dataUndefined);
      });

      it('does not accept wrong type', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Boolean() };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with common constraint', () => {
      it('accepts whichever boolean', () => {
        const data = { value: false };
        const dataSchema = { value: Types.Boolean({ notNull: true }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Boolean({ notNull: true }) };
        assert.throws(() => { validate(dataSchema, dataNull) });
        assert.throws(() => { validate(dataSchema, dataUndefind) });
      });

      it('accepts null or undefined when default value is given', () => {
        const defaultValue = true;
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Boolean({ notNull: true, defaultTo: defaultValue }) };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, { value: defaultValue });
        assert.deepEqual(resultUndefined, { value: defaultValue });
      });

      it('returns given boolean rather than default values', () => {
        const data = { value: true };
        const dataSchema = { value: Types.Boolean({ defaultTo: false }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
    });
  });


  describe('#Array', () => {
    context('without constraint', () => {
      it('accepts any array', () => {
        const data = { value: [] };
        const dataSchema = { value: Types.Array() };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('accepts null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Array() };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, dataNull);
        assert.deepEqual(resultUndefined, dataUndefined);
      });

      it('does not accept wrong type', () => {
        const data = { value: "test" };
        const dataSchema = { value: Types.Array() };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with common constraint', () => {
      it('accepts any array', () => {
        const data = { value: [] };
        const dataSchema = { value: Types.Array({ notNull: true }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Array({ notNull: true }) };
        assert.throws(() => { validate(dataSchema, dataNull) });
        assert.throws(() => { validate(dataSchema, dataUndefind) });
      });

      it('accepts null or undefined when default value is given', () => {
        const defaultValue = [];
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Array({ notNull: true, defaultTo: defaultValue }) };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, { value: defaultValue });
        assert.deepEqual(resultUndefined, { value: defaultValue });
      });

      it('returns given string rather than default values', () => {
        const data = { value: [] };
        const dataSchema = { value: Types.Array({ defaultTo: ["hoge"] }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
    });

    context('with length constraint', () => {
      it('accepts array shorter than limitsize', () => {
        const data = { value: [1] };
        const dataSchema = { value: Types.Array({ shorterThan: 5 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
      it('does not accept array longer than limitsize', () => {
        const data = { value: [1, 2, 3, 4, 5, 6] };
        const dataSchema = { value: Types.Array({ shorterThan: 5 }) };
        assert.throws(() => { validate(dataSchema, data) });
      });

      it('accepts array longer than limitsize', () => {
        const data = { value: [1, 2, 3, 4, 5, 6] };
        const dataSchema = { value: Types.Array({ longerThan: 5 }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
      it('does not accept array shorter than limitsize', () => {
        const data = { value: [1] };
        const dataSchema = { value: Types.Array({ longerThan: 5 }) };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with item constraint', () => {
      it('accepts array satisfying with item constraint', () => {
        const item = { item: "item" };
        const data = { value: [item] };
        const itemSchema = { item: Types.String() };
        const dataSchema = { value: Types.Array({ itemSchema: itemSchema }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept array including item not satisfying with constraint', () => {
        const item = { item: 1 };
        const data = { value: [item] };
        const itemSchema = { item: Types.String() };
        const dataSchema = { value: Types.Array({ itemSchema: itemSchema }) };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });
  });

  describe('#Object', () => {
    context('without constraint', () => {
      it('accepts any object', () => {
        const data = { value: {} };
        const dataSchema = { value: Types.Object() };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('accepts null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Object() };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, dataNull);
        assert.deepEqual(resultUndefined, dataUndefined);
      });

      it('does not accept wrong type', () => {
        const data = { value: "test" };
        const dataSchema = { value: Types.Object() };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with common constraint', () => {
      it('accepts any array', () => {
        const data = { value: {} };
        const dataSchema = { value: Types.Object({ notNull: true }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Object({ notNull: true }) };
        assert.throws(() => { validate(dataSchema, dataNull) });
        assert.throws(() => { validate(dataSchema, dataUndefind) });
      });

      it('accepts null or undefined when default value is given', () => {
        const defaultValue = {};
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Object({ notNull: true, defaultTo: defaultValue }) };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, { value: defaultValue });
        assert.deepEqual(resultUndefined, { value: defaultValue });
      });

      it('returns given object rather than default values', () => {
        const data = { value: { value: "given" } };
        const dataSchema = { value: Types.Object({ defaultTo: { value: "default" } }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });
    });

    context('with nested constraint', () => {
      it('accepts object satisfying with nested constraint', () => {
        const nest = { nest: "nest" };
        const data = { value: nest };
        const nestSchema = { nest: Types.String() };
        const dataSchema = { value: Types.Object({ schema: nestSchema }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept object not satisfying with nested constraint', () => {
        const nest = { nest: 1 };
        const data = { value: nest };
        const nestSchema = { nest: Types.String() };
        const dataSchema = { value: Types.Object({ schema: nestSchema }) };
        assert.throws(() => { validate(dataSchema, data) });
      });

      it('accepts object satisfying with repeatedly nested constraint', () => {
        const nest2 = { nest: "nest" };
        const nest1 = { nest: nest2 };
        const data = { value: nest1 };
        const nest2Schema = { nest: Types.String() };
        const nest1Schema = { nest: Types.Object({ schema: nest2Schema }) };
        const dataSchema = { value: Types.Object({ schema: nest1Schema }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept object not satisfying with repeatedly nested constraint', () => {
        const nest2 = { nest: 1 };
        const nest1 = { nest: nest2 };
        const data = { value: nest1 };
        const nest2Schema = { nest: Types.String() };
        const nest1Schema = { nest: Types.Object({ schema: nest2Schema }) };
        const dataSchema = { value: Types.Object({ schema: nest1Schema }) };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });
  });

  describe('#Enum', () => {
    context('with values constraint', () => {
      it('does not accept no constraint about values', () => {
        assert.throws(() => { Types.Enum() });
      });

      it('accept values enumerated in constraint', () => {
        const data = { value: "enum1" }
        const dataSchema = { value: Types.Enum({ values: ["enum1", "enum2"] }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept values not enumerated in constraint', () => {
        const data = { value: "enum3" }
        const dataSchema = { value: Types.Enum({ values: ["enum1", "enum2"] }) };
        assert.throws(() => { validate(dataSchema, data) });
      });

      describe('accepts any Types of values enumerated in constraint', () => {
        const nl = { value: null };
        const ud = { value: undefined };
        const str = { value: "str" };
        const num = { value: 1 };
        const bool = { value: true }
        const obj = { value: { obj: "obj" } }
        const array = { value: [] }
        const values = [nl, ud, str, num, bool, obj, array].map((item) => { return item.value; });
        const enumSchema = { value: Types.Enum({ values: values }) };

        it('accepts null', () => {
          const nlResult = validate(enumSchema, nl);
          assert.deepEqual(nlResult, nl);
        });

        it('accepts undefined', () => {
          const udResult = validate(enumSchema, ud);
          assert.deepEqual(udResult, ud);
        });

        it('accepts string', () => {
          const strResult = validate(enumSchema, str);
          assert.deepEqual(strResult, str);
        });

        it('accepts number', () => {
          const numResult = validate(enumSchema, num);
          assert.deepEqual(numResult, num);
        });

        it('accepts boolean', () => {
          const boolResult = validate(enumSchema, bool);
          assert.deepEqual(boolResult, bool);
        });

        it('accepts object', () => {
          const objResult = validate(enumSchema, obj);
          assert.deepEqual(objResult, obj);
        });

        it('accepts array', () => {
          const arrayResult = validate(enumSchema, array);
          assert.deepEqual(arrayResult, array);
        });
      });
    });
  });

  describe('#Function', () => {
    context('without constraint', () => {
      it('accepts any function', () => {
        const data = { value: function () { } };
        const dataSchema = { value: Types.Function() };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('accepts null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Function() };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, dataNull);
        assert.deepEqual(resultUndefined, dataUndefined);
      });

      it('does not accept wrong type', () => {
        const data = { value: 1 };
        const dataSchema = { value: Types.Function() };
        assert.throws(() => { validate(dataSchema, data) });
      });
    });

    context('with common constraint', () => {
      it('accepts any function', () => {
        const data = { value: function () { } };
        const dataSchema = { value: Types.Function({ notNull: true }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result, data);
      });

      it('does not accept null or undefined', () => {
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Function({ notNull: true }) };
        assert.throws(() => { validate(dataSchema, dataNull) });
        assert.throws(() => { validate(dataSchema, dataUndefind) });
      });

      it('accepts null or undefined when default value is given', () => {
        const defaultValue = function () { };
        const dataNull = { value: null };
        const dataUndefined = { value: undefined };
        const dataSchema = { value: Types.Function({ notNull: true, defaultTo: defaultValue }) };
        const resultNull = validate(dataSchema, dataNull);
        const resultUndefined = validate(dataSchema, dataUndefined);
        assert.deepEqual(resultNull, { value: defaultValue });
        assert.deepEqual(resultUndefined, { value: defaultValue });
      });

      it('returns given function rather than default values', () => {
        const data = { value: function () { return 1; } };
        const dataSchema = { value: Types.Function({ defaultTo: function () { return 2; } }) };
        const result = validate(dataSchema, data);
        assert.deepEqual(result.value(), data.value());
      });
    });
  });
});