import test from "ava";

import { parse, stringify } from "..";

test("query strings starting with a `?`", t => {
  t.deepEqual(parse("?foo=bar"), { foo: "bar" });
});

test("query strings starting with a `#`", t => {
  t.deepEqual(parse("#foo=bar"), { foo: "bar" });
});

test("query strings starting with a `&`", t => {
  t.deepEqual(parse("&foo=bar&foo=baz"), { foo: ["bar", "baz"] });
});

test("parse a query string", t => {
  t.deepEqual(parse("foo=bar"), { foo: "bar" });
});

test("parse multiple query string", t => {
  t.deepEqual(parse("foo=bar&key=val"), {
    foo: "bar",
    key: "val"
  });
});

test("parse query string without a value", t => {
  t.deepEqual(parse("foo"), { foo: null });
  t.deepEqual(parse("foo&key"), {
    foo: null,
    key: null
  });
  t.deepEqual(parse("foo=bar&key"), {
    foo: "bar",
    key: null
  });
  t.deepEqual(parse("a&a"), { a: [null, null] });
  t.deepEqual(parse("a=&a"), { a: ["", null] });
});

test("return empty object if no qss can be found", t => {
  t.deepEqual(parse("?"), {});
  t.deepEqual(parse("&"), {});
  t.deepEqual(parse("#"), {});
  t.deepEqual(parse(" "), {});
});

test("handle `+` correctly", t => {
  t.deepEqual(parse("foo+faz=bar+baz++"), { "foo faz": "bar baz  " });
});

test("handle multiple of the same key", t => {
  t.deepEqual(parse("foo=bar&foo=baz"), { foo: ["bar", "baz"] });
});

test("handle multiple values and preserve appearence order", t => {
  t.deepEqual(parse("a=value&a="), { a: ["value", ""] });
  t.deepEqual(parse("a=&a=value"), { a: ["", "value"] });
});

test("query strings params including embedded `=`", t => {
  t.deepEqual(parse("?param=https%3A%2F%2Fsomeurl%3Fid%3D2837"), {
    param: "https://someurl?id=2837"
  });
});

test("query strings having indexed arrays", t => {
  t.deepEqual(parse("foo[0]=bar&foo[1]=baz"), {
    "foo[0]": "bar",
    "foo[1]": "baz"
  });
});

test("query strings having brackets arrays", t => {
  t.deepEqual(parse("foo[]=bar&foo[]=baz"), { "foo[]": ["bar", "baz"] });
});

test("query strings having indexed arrays keeping index order", t => {
  t.deepEqual(parse("foo[1]=bar&foo[0]=baz"), {
    "foo[0]": "baz",
    "foo[1]": "bar"
  });
});

test("circuit parse -> stringify", t => {
  const original = "foo=foo&foo&foo=one&foo=&bat=buz";
  const sortedOriginal = "bat=buz&foo=foo&foo&foo=one&foo=";
  const expected = { bat: "buz", foo: ["foo", null, "one", ""] };
  t.deepEqual(parse(original), expected);

  t.is(stringify(expected), sortedOriginal);
});

test("circuit original -> parse - > stringify -> sorted original", t => {
  const original =
    "foo[21474836471]=foo&foo[21474836470]&foo[1]=one&foo[0]=&bat=buz";
  const sortedOriginal =
    "bat=buz&foo%5B0%5D=&foo%5B1%5D=one&foo%5B21474836470%5D&foo%5B21474836471%5D=foo";
  t.deepEqual(stringify(parse(original)), sortedOriginal);
});

test("decode keys and values", t => {
  t.deepEqual(parse("st%C3%A5le=foo"), { ståle: "foo" });
  t.deepEqual(parse("foo=%7B%25ab%25%7C%25de%25%7D%20%25%7Bst%C3%A5le%7D%25"), {
    foo: "{%ab%|%de%} %{ståle}%"
  });
});
