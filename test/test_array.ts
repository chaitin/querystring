import test from 'ava'

import {arrayFormatEncoder, arrayFormatParser} from '..'

test('encode', t => {
  t.is(arrayFormatEncoder('a', null), 'a')
  t.is(arrayFormatEncoder('a', 'ddd'), 'a=ddd')
  t.is(arrayFormatEncoder('!233!', '!@#"**abc'), '%21233%21=%21%40%23%22%2A%2Aabc')
})
