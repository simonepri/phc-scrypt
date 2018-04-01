import test from 'ava';

import m from '..';

test("should throw an error if the 'cost' option is not a number", async t => {
  const err = await t.throws(m.hash('password', {cost: 'cost'}));
  t.is(err.message, "The 'cost' option must be an integer");
});

test("should throw an error if the 'cost' option is out of range", async t => {
  let err = await t.throws(m.hash('password', {cost: -1}));
  t.regex(err.message, /The 'cost' option must be in the range/);

  err = await t.throws(m.hash('password', {cost: 2 ** 32}));
  t.regex(err.message, /The 'cost' option must be in the range/);
});

test("should throw an error if the 'blocksize' option is not a number", async t => {
  const err = await t.throws(m.hash('password', {blocksize: 'blocksize'}));
  t.is(err.message, "The 'blocksize' option must be an integer");
});

test("should throw an error if the 'blocksize' option is out of range", async t => {
  let err = await t.throws(m.hash('password', {blocksize: -1}));
  t.regex(err.message, /The 'blocksize' option must be in the range/);

  err = await t.throws(m.hash('password', {blocksize: 2 ** 32}));
  t.regex(err.message, /The 'blocksize' option must be in the range/);
});

test("should throw an error if the 'parallelism' option is not a number", async t => {
  const err = await t.throws(m.hash('password', {parallelism: 'parallelism'}));
  t.is(err.message, "The 'parallelism' option must be an integer");
});

test("should throw an error if the 'parallelism' option is out of range", async t => {
  let err = await t.throws(m.hash('password', {parallelism: -1}));
  t.regex(err.message, /The 'parallelism' option must be in the range/);

  err = await t.throws(m.hash('password', {parallelism: 2 ** 32}));
  t.regex(err.message, /The 'parallelism' option must be in the range/);
});

test("should throw an error if the 'saltSize' option is out of range", async t => {
  let err = await t.throws(m.hash('password', {saltSize: -1}));
  t.regex(err.message, /The 'saltSize' option must be in the range/);

  err = await t.throws(m.hash('password', {saltSize: 1025}));
  t.regex(err.message, /The 'saltSize' option must be in the range/);
});
