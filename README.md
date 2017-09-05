<h1 align="center">
  <a href="https://github.com/simonepri/credential-plus"><img src="https://github.com/simonepri/credential-plus/blob/master/media/credential-plus.png?raw=true" alt="credential-plus-scrypt" /></a>
</h1>
<div align="center">
  <a href="https://travis-ci.org/simonepri/credential-plus-scrypt"> <img src="https://travis-ci.org/simonepri/credential-plus-scrypt.svg?branch=master" alt="build status"></a>
  <a href="https://codecov.io/gh/simonepri/credential-plus-scrypt"><img src="https://img.shields.io/codecov/c/github/simonepri/credential-plus-scrypt/master.svg" alt="code coverage" /></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="code style" /></a>
  <a href="https://www.npmjs.com/package/credential-plus-scrypt"><img src="https://img.shields.io/npm/v/credential-plus-scrypt.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/credential-plus-scrypt"><img src="https://img.shields.io/npm/dm/credential-plus-scrypt.svg" alt="npm downloads" /></a>
  <a href="https://david-dm.org/simonepri/credential-plus-scrypt"><img src="https://david-dm.org/simonepri/credential-plus-scrypt.svg" alt="dependencies" /></a>
  <a href="https://david-dm.org/simonepri/credential-plus-scrypt#info=devDependencies"><img src="https://david-dm.org/simonepri/credential-plus-scrypt/dev-status.svg" alt="dev dependencies" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/simonepri/credential-plus-scrypt.svg" alt="license" /></a>
</div>
<br />
<div align="center">
  🛡 SCrypt password hashing function for [credential-plus](https://github.com/simonepri/credential-plus).
</div>
<div align="center">
  <sub>
    If you find a security flaw in this code, PLEASE [report it](issues/new).
  </sub>
</div>

## Install

```
$ npm install --save credential-plus-scrypt
```

## Usage
```js
const credential = require('credential-plus');
credential.install(require('credential-plus-scrypt'));

// Hash and verify with scrypt and default configs
credential.hash('We are all unicorns', {func: 'scrypt'})
  .then(hash) => {

    console.log(hash);
    //=> {"hash":"c2NyeXB0AA8AAAAIAAAAAdZuQumEF/m0V747VleWqvYZKhjOgXgQGtIsgOmLQwwc6KZuU2t1uEkqs9tABwGZyFHdCGkSxzpBLtMgx6UVtKwfcuRGKM2uGu1FvJt8avmU","func":"scrypt"}

    credential.verify(hash, 'We are all unicorns')
      .then(match) => {
        console.log(match);
        //=> true
      });

  });
```

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/credential-plus-scrypt/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
