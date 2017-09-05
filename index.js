'use strict';

const scrypt = require('scrypt');
const Buffer = require('safe-buffer').Buffer;

const _ = require('lodash');

/**
 * Default configurations used to generate a new hash.
 * @private
 * @type {object}
 */
const defaultConfigs = {
  // The maximum amount of time in seconds scrypt will spend when computing the
  // derived key.
  maxtime: 0.15,
  // The maximum number of bytes of RAM used when computing the derived
  // encryption key. If not present, will default to 0.
  maxmem: 0,
  // A double value between 0.0 and 1.0, representing the fraction (normalized
  // percentage value) of the available RAM used when computing the derived key.
  // If not present, will default to 0.5.
  maxmemfrac: 0.5
};

/**
 * Generates an unique hash and the data needed to verify it.
 * @public
 * @param  {string} password The password to hash.
 * @param  {object} configs Configurations related to the hashing function.
 * @returns {Promise<string>} A promise that contains the generated hash string.
 */
function hashFunc(password, configs) {
  const cfgs = _.extend(defaultConfigs, configs);

  return new Promise((resolve, reject) => {
    scrypt.params(cfgs.maxtime, cfgs.maxmem, cfgs.maxmemfrac)
      .then(params => scrypt.kdf(password, params))
      .then(hash => resolve(hash.toString('base64')))
      .catch(reject);
  });
}

/**
 * Determines whether or not the user's input matches the stored password.
 * @public
 * @param  {string} hash Stringified hash object generated from this package.
 * @param  {string} input User's password input.
 * @returns {Promise<boolean>} A promise that contains a boolean that is true if
 *   if the hash computed for the input matches.
 */
function verifyFunc(hash, password) {
  return scrypt.verifyKdf(Buffer.from(hash, 'base64'), Buffer.from(password));
}

module.exports = {
  hash: hashFunc,
  verify: verifyFunc,
  name: 'scrypt'
};
