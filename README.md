# querystring
[![Build Status](https://travis-ci.org/chaitin/querystring.svg?branch=master)](https://travis-ci.org/chaitin/querystring)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Parse and stringify URL query strings. Forked from [query-string](https://github.com/sindresorhus/query-string)

## Install
```bash
yarn add @chaitin/querystring
```

## Usage
```ts
import { parse, stringify } from '@chaitin/querystring'

const result = parse("foo=foo&foo&foo=one&foo=&bat=buz")
// the result is:
{ bat: "buz", foo: ["foo", null, "one", ""] }

// result is sorted by key
let qs = stringify({
  page: "10",
  pageSize: 200,
  filter: ["aaa", "bbb", "ccc", 255]
})
qs === "filter=aaa&filter=bbb&filter=ccc&filter=255&page=10&pageSize=200"

// and you can disable sorting
qs = stringify({
  page: "10",
  pageSize: 200,
  filter: ["aaa", "bbb", "ccc", 255]
}, { sort: false })
qs === "page=10&pageSize=200&filter=aaa&filter=bbb&filter=ccc&filter=255"
```

## License
MIT
