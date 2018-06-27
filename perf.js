// @flow
'use strict';
const spawn = require('spawndamnit');
const grob = require('./');

async function main() {
  let times = 100;

  console.log(`running ${times}x...`);

  console.time('grep');
  for (let i = 0; i < times; i++) {
    await spawn('grep', ['-r', 'goodbye', './fixture']);
  }
  console.timeEnd('grep');

  console.time('grob');
  for (let i = 0; i < times; i++) {
    await grob({ cwd: __dirname, globs: ['./fixture/**'], regex: /goodbye/ });
  }
  console.timeEnd('grob');
}

main();
