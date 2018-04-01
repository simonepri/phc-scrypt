import test from 'ava';

import m from '..';

test('should verify a precomputed hash', async t => {
  // Precomputed hash for "password"
  const hash =
    '$scrypt$n=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  t.true(await m.verify(hash, 'password'));
});

test('should throw an error if the identifier is unsupported', async t => {
  const wrong =
    '$script$n=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  const err = await t.throws(m.verify(wrong, 'password'));
  t.is(err.message, 'Incompatible script identifier found in the hash');
});

test("should throw an error if the 'n' parameter is missing", async t => {
  const wrong =
    '$scrypt$r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  const err = await t.throws(m.verify(wrong, 'password'));
  t.is(err.message, "The 'n' param must be an integer");
});

test("should throw an error if the 'n' parameter is out of range", async t => {
  let wrong =
    '$scrypt$n=0,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  let err = await t.throws(m.verify(wrong, 'password'));
  t.regex(err.message, /The 'n' param must be in the range/);

  wrong =
    '$scrypt$n=256,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  err = await t.throws(m.verify(wrong, 'password'));
  t.regex(err.message, /The 'n' param must be in the range/);
});

test("should throw an error if the 'r' parameter is missing", async t => {
  const wrong =
    '$scrypt$n=16,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  const err = await t.throws(m.verify(wrong, 'password'));
  t.is(err.message, "The 'r' param must be an integer");
});

test("should throw an error if the 'r' parameter is out of range", async t => {
  let wrong =
    '$scrypt$n=16,r=-1,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  let err = await t.throws(m.verify(wrong, 'password'));
  t.regex(err.message, /The 'r' param must be in the range/);

  wrong =
    '$scrypt$n=16,r=4294967296,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  err = await t.throws(m.verify(wrong, 'password'));
  t.regex(err.message, /The 'r' param must be in the range/);
});

test("should throw an error if the 'p' parameter is missing", async t => {
  const wrong =
    '$scrypt$n=16,r=8$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  const err = await t.throws(m.verify(wrong, 'password'));
  t.is(err.message, "The 'p' param must be an integer");
});

test("should throw an error if the 'p' parameter is out of range", async t => {
  let wrong =
    '$scrypt$n=16,r=8,p=0$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  let err = await t.throws(m.verify(wrong, 'password'));
  t.regex(err.message, /The 'p' param must be in the range/);

  wrong =
    '$scrypt$n=16,r=8,p=4294967296$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  err = await t.throws(m.verify(wrong, 'password'));
  t.regex(err.message, /The 'p' param must be in the range/);
});

test('should throw an error if salt is not given', async t => {
  const wrong = '$scrypt$n=16,r=8,p=1';

  const err = await t.throws(m.verify(wrong, 'password'));
  t.is(err.message, 'No salt found in the given string');
});

test('should throw an error if hash is not given', async t => {
  const wrong = '$scrypt$n=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q';

  const err = await t.throws(m.verify(wrong, 'password'));
  t.is(err.message, 'No hash found in the given string');
});

test('should throw an error if the hash is not in PHC format', async t => {
  const hash =
    '$scrypt$16,8,1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E';

  await t.throws(m.verify(hash, 'password'));
});
