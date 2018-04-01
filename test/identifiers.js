import test from 'ava';

import m from '..';

test('should return the full list of identifiers', t => {
  t.deepEqual(m.identifiers(), ['scrypt']);
});
