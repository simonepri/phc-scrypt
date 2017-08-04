# credential-plus-scrypt
[![Travis CI](https://travis-ci.org/simonepri/credential-plus-scrypt.svg?branch=master)](https://travis-ci.org/simonepri/credential-plus-scrypt) [![Codecov](https://img.shields.io/codecov/c/github/simonepri/credential-plus-scrypt/master.svg)](https://codecov.io/gh/simonepri/credential-plus-scrypt) [![npm](https://img.shields.io/npm/dm/credential-plus-scrypt.svg)](https://www.npmjs.com/package/credential-plus-scrypt) [![npm version](https://img.shields.io/npm/v/credential-plus-scrypt.svg)](https://www.npmjs.com/package/credential-plus-scrypt) [![npm dependencies](https://david-dm.org/simonepri/credential-plus-scrypt.svg)](https://david-dm.org/simonepri/credential-plus-scrypt) [![npm dev dependencies](https://david-dm.org/simonepri/credential-plus-scrypt/dev-status.svg)](https://david-dm.org/simonepri/credential-plus-scrypt#info=devDependencies)
> 🛡 scrypt plugin for credential-plus

This package is thought to be used in conjunction with [credential-plus](https://github.com/simonepri/credential-plus)

If you find a security flaw in this code, please [report it](issues/new).

## Install

```
$ npm install --save credential-plus-scrypt
```

## Usage
```js
const credential = require('credential-plus');
credential.install(require('credential-plus-scrypt'));

// Hash and verify with scrypt and default configs
credential.hash('We are all unicorns', {func: 'scrypt'}, (err, hash) => {
  console.log(hash);
  //=> {"hash":"c2NyeXB0AA8AAAAIAAAAAdZuQumEF/m0V747VleWqvYZKhjOgXgQGtIsgOmLQwwc6KZuU2t1uEkqs9tABwGZyFHdCGkSxzpBLtMgx6UVtKwfcuRGKM2uGu1FvJt8avmU","func":"scrypt"}
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> true
  })
});
```

## API

### hash(password, options, callback)

Creates a new 'unique' hash from a password.

#### password

Type: `string`

The password to hash.

#### options

Type: `object`

Configurations for the hash function.

##### maxtime

Type: `number`<br>
Default: 0.15

The maximum amount of time in seconds scrypt will spend when computing the
derived key.

##### maxmem

Type: `number`<br>
Default: 0

The maximum number of bytes of RAM used when computing the derived encryption
key. If not present, will default to 0.

##### maxmemfrac

Type: `number`<br>
Default: 0.5

A double value between 0.0 and 1.0, representing the fraction (normalized
percentage value) of the available RAM used when computing the derived key.

#### callback(err, hash)

Type: `function`

Called after the hash has been computed.

#### err

Type: `object`

Possible error thrown.

#### hash

Type: `object`

The generated hash.

### verify(hash, input, callback)

Determines whether or not the user's input matches the stored password.

#### hash

Type: `string`

An hash generated from this package.

#### input

Type: `string`

User's input input.

#### callback(err, valid)

Type: `string`

Called after the verification process has been computed.

#### err

Type: `object`

Possible error thrown.

##### valid

Type: `boolean`

True if the hash computed for the input matches.

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/credential-plus-scrypt/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
