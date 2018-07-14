const execa = require('execa');
const pbkdf2 = require('.');

async function bench(hpass, vpass, options) {
  const hash = await pbkdf2.hash(hpass, options);
  return execa(
    'sympact',
    ['--interval=25', `await require(".").verify("${hash}","${vpass}")`],
    {
      env: {FORCE_COLOR: true},
      windowsVerbatimArguments: true
    }
  );
}

Promise.resolve()
  // Default configs
  .then(() => bench('r9(yaV@L', 'r9(yaV@L'))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })

  // Custom Cost
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {cost: 10}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {cost: 14}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {cost: 16}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {cost: 18}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {cost: 20}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })

  // Custom Blocksize
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {blocksize: 9}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {blocksize: 10}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {blocksize: 11}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })
  .then(() => bench('r9(yaV@L', 'r9(yaV@L', {blocksize: 12}))
  .then(results => {
    console.log('► CMD:', results.cmd);
    console.log(results.stdout);
  })

  .catch(err => {
    console.error(err);
  });
