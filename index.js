/* eslint-disable max-params,capitalized-comments,complexity */
'use strict';

const crypto = require('crypto');
const scrypt = require('scrypt');
const pify = require('pify');
const tsse = require('tsse');
const phc = require('@phc/format');

const MAX_UINT32 = 4294967295; // 2**32 - 1

/**
 * Default configurations used to generate a new hash.
 * @private
 * @type {Object}
 */
const defaults = Object.freeze({
  // CPU/memory cost (N), in number of sequential hash results stored in RAM by the ROMix function.
  cost: 15, // 2^15
  // blocksize (r), in bits used by the BlockMix function.
  blocksize: 8,
  // parallelism (p), in number of instances of the mixing function run independently.
  parallelism: 1,
  // The minimum recommended size for the salt is 128 bits.
  saltSize: 16,
});

/**
 * Generates a cryptographically secure random string for use as a password salt
 * using Node's built-in crypto.randomBytes().
 * @private
 * @param  {number} length The length of the salt to be generated.
 * @return {Promise.<string>} The salt string.
 */
function genSalt(length) {
  return pify(crypto.randomBytes)(length);
}

/**
 * Computes the hash string of the given password in the PHC format using scrypt
 * package.
 * @public
 * @param  {string} password The password to hash.
 * @param  {Object} [options] Optional configurations related to the hashing
 * function.
 * @param  {number} [options.blocksize=8] Optional amount of memory to use in
 * kibibytes.
 * Must be an integer within the range (`8` <= `memory` <= `2^32-1`).
 * @param  {number} [options.cost=15] Optional CPU/memory cost parameter.
 * Must be an integer power of 2 within the range
 * (`2` <= `cost` <= `2^((128 * blocksize) / 8) - 1`).
 * @param  {number} [options.parallelism=1] Optional degree of parallelism to
 * use.
 * Must be an integer within the range
 * (`1` <= `parallelism` <= `((2^32-1) * 32) / (128 * blocksize)`).
 * @return {Promise.<string>} The generated secure hash string in the PHC
 * format.
 */
function hash(password, options) {
  options = options || {};
  const blocksize = options.blocksize || defaults.blocksize;
  const cost = options.cost || defaults.cost;
  const parallelism = options.parallelism || defaults.parallelism;
  const saltSize = options.saltSize || defaults.saltSize;

  // Blocksize Validation
  if (typeof blocksize !== 'number' || !Number.isInteger(blocksize)) {
    return Promise.reject(
      new TypeError("The 'blocksize' option must be an integer")
    );
  }
  if (blocksize < 1 || blocksize > MAX_UINT32) {
    return Promise.reject(
      new TypeError(
        `The 'blocksize' option must be in the range (1 <= blocksize <= ${MAX_UINT32})`
      )
    );
  }

  // Cost Validation
  if (typeof cost !== 'number' || !Number.isInteger(cost)) {
    return Promise.reject(
      new TypeError("The 'cost' option must be an integer")
    );
  }
  const maxcost = 128 * blocksize / 8 - 1;
  if (cost < 2 || cost > maxcost) {
    return Promise.reject(
      new TypeError(
        `The 'cost' option must be in the range (1 <= cost <= ${maxcost})`
      )
    );
  }

  // Parallelism Validation
  if (typeof parallelism !== 'number' || !Number.isInteger(parallelism)) {
    return Promise.reject(
      new TypeError("The 'parallelism' option must be an integer")
    );
  }
  const maxpar = Math.floor((2 ** 32 - 1) * 32 / (128 * blocksize));
  if (parallelism < 1 || parallelism > maxpar) {
    return Promise.reject(
      new TypeError(
        `The 'parallelism' option must be in the range (1 <= parallelism <= ${maxpar})`
      )
    );
  }

  // Salt Size Validation
  if (saltSize < 8 || saltSize > 1024) {
    return Promise.reject(
      new TypeError(
        "The 'saltSize' option must be in the range (8 <= parallelism <= 1023)"
      )
    );
  }

  const params = {
    N: 2 ** cost,
    r: blocksize,
    p: parallelism,
  };
  const keylen = 32;

  return genSalt(saltSize).then(salt => {
    return scrypt.hash(password, params, keylen, salt).then(hash => {
      const phcstr = phc.serialize({
        id: 'scrypt',
        params: {
          n: cost,
          r: blocksize,
          p: parallelism,
        },
        salt,
        hash,
      });
      return phcstr;
    });
  });
}

/**
 * Determines whether or not the hash stored inside the PHC formatted string
 * matches the hash generated for the password provided.
 * @public
 * @param  {string} password User's password input.
 * @param  {string} phcstr Secure hash string generated from this package.
 * @returns {Promise.<boolean>} A boolean that is true if the hash computed
 * for the password matches.
 */
function verify(phcstr, password) {
  let phcobj;
  try {
    phcobj = phc.deserialize(phcstr);
  } catch (err) {
    return Promise.reject(err);
  }

  // Identifier Validation
  if (phcobj.id !== 'scrypt') {
    return Promise.reject(
      new TypeError(`Incompatible ${phcobj.id} identifier found in the hash`)
    );
  }

  // Blocksize Validation
  if (
    typeof phcobj.params.r !== 'number' ||
    !Number.isInteger(phcobj.params.r)
  ) {
    return Promise.reject(new TypeError("The 'r' param must be an integer"));
  }
  if (phcobj.params.r < 1 || phcobj.params.r > MAX_UINT32) {
    return Promise.reject(
      new TypeError(
        `The 'r' param must be in the range (1 <= r <= ${MAX_UINT32})`
      )
    );
  }

  // Cost Validation
  if (
    typeof phcobj.params.n !== 'number' ||
    !Number.isInteger(phcobj.params.n)
  ) {
    return Promise.reject(new TypeError("The 'n' param must be an integer"));
  }
  const maxcost = 128 * phcobj.params.r / 8 - 1;
  if (phcobj.params.n < 1 || phcobj.params.n > maxcost) {
    return Promise.reject(
      new TypeError(`The 'n' param must be in the range (1 <= n <= ${maxcost})`)
    );
  }

  // Parallelism Validation
  if (
    typeof phcobj.params.p !== 'number' ||
    !Number.isInteger(phcobj.params.p)
  ) {
    return Promise.reject(new TypeError("The 'p' param must be an integer"));
  }
  const maxpar = Math.floor((2 ** 32 - 1) * 32 / (128 * phcobj.params.p));
  if (phcobj.params.p < 1 || phcobj.params.p > maxpar) {
    return Promise.reject(
      new TypeError(`The 'p' param must be in the range (1 <= p <= ${maxpar})`)
    );
  }

  const params = {
    N: 2 ** phcobj.params.n,
    r: phcobj.params.r,
    p: phcobj.params.p,
  };

  // Salt Validation
  if (typeof phcobj.salt === 'undefined') {
    return Promise.reject(new TypeError('No salt found in the given string'));
  }
  const salt = phcobj.salt;

  // Hash Validation
  if (typeof phcobj.hash === 'undefined') {
    return Promise.reject(new TypeError('No hash found in the given string'));
  }

  const hash = phcobj.hash;
  const keylen = phcobj.hash.byteLength;

  return scrypt.hash(password, params, keylen, salt).then(newhash => {
    const match = tsse(hash.toString('base64'), newhash.toString('base64'));
    return match;
  });
}

/**
 * Gets the list of all identifiers supported by this hashing function.
 * @public
 * @returns {string[]} A list of identifiers supported by this hashing function.
 */
function identifiers() {
  return ['scrypt'];
}

module.exports = {
  hash,
  verify,
  identifiers,
};
