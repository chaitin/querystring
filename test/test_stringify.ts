import test from "ava";

import { stringify } from "../src";

// tslint:disable:object-literal-sort-keys

test("stringify", t => {
  t.is(stringify({ foo: "bar" }), "foo=bar");
  t.is(
    stringify({
      foo: "bar",
      bar: "baz"
    }),
    "bar=baz&foo=bar"
  );
  t.is(stringify({ "foo bar": "baz faz" }), "foo%20bar=baz%20faz");
  t.is(stringify({ "foo bar": "baz'faz" }), "foo%20bar=baz%27faz");
});

test("handle number", t => {
  t.is(stringify({ a: 1 }), "a=1");
});

test("handle array value", t => {
  t.is(
    stringify({
      page: "10",
      pageSize: 200,
      filter: ["aaa", "bbb", "ccc", 255]
    }),
    "filter=aaa&filter=bbb&filter=ccc&filter=255&page=10&pageSize=200"
  );
});

test("no sort", t => {
  t.is(
    stringify(
      {
        page: "10",
        pageSize: 200,
        filter: ["aaa", "bbb", "ccc", 255]
      },
      { sort: false }
    ),
    "page=10&pageSize=200&filter=aaa&filter=bbb&filter=ccc&filter=255"
  );
});

test("handle empty array value", t => {
  t.is(
    stringify({
      abc: "abc",
      foo: []
    }),
    "abc=abc"
  );
});

test("handle null", t => {
  t.is(
    stringify({
      pdd: null
    }),
    "pdd"
  );
  t.is(
    stringify({
      c: "1",
      d: null,
      e: ["1", 2, null, 4]
    }),
    "c=1&d&e=1&e=2&e&e=4"
  );
});

test("should not encode undefined values", t => {
  t.is(
    stringify({
      abc: undefined,
      foo: "baz"
    }),
    "foo=baz"
  );
});

test("should encode null values as just a key", t => {
  t.is(
    stringify({
      "x y z": null,
      abc: null,
      foo: "baz"
    }),
    "abc&foo=baz&x%20y%20z"
  );
});

test("handle null values in array", t => {
  t.is(
    stringify({
      foo: null,
      bar: [null, "baz"]
    }),
    "bar&bar=baz&foo"
  );
});

test("handle undefined values in array", t => {
  t.is(
    stringify({
      foo: null,
      bar: [undefined, "baz"]
    }),
    "bar=baz&foo"
  );
});

test("handle undefined and null values in array", t => {
  t.is(
    stringify({
      foo: null,
      bar: [null, "baz"]
    }),
    "bar&bar=baz&foo"
  );
});

test("strict encoding", t => {
  t.is(stringify({ foo: "'bar'" }), "foo=%27bar%27");
  t.is(stringify({ foo: ["'bar'", "!baz"] }), "foo=%27bar%27&foo=%21baz");
});
