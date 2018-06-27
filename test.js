// @flow
'use strict';
const test = require('ava');
const path = require('path');
const grob = require('./');

test('grob', async (t) /*: any */ => {
  let matches = await grob({
    cwd: __dirname,
    globs: ['fixture/*.txt', '!**/not-me.txt'],
    regex: /goodbye/g,
  });

  t.is(matches.size, 1);

  let fixtureMatches = matches.get('fixture/hello-goodbye.txt');
  let filePath = path.join(__dirname, 'fixture', 'hello-goodbye.txt');

  t.deepEqual(fixtureMatches, [
    { filePath, line: 4, start: 0, end: 7, lineContents: 'goodbye' },
    { filePath, line: 9, start: 6, end: 13, lineContents: 'hello goodbye' },
    { filePath, line: 14, start: 6, end: 13, lineContents: 'hello goodbye hello goodbye' },
    { filePath, line: 14, start: 20, end: 27, lineContents: 'hello goodbye hello goodbye' },
    { filePath, line: 19, start: 0, end: 7, lineContents: 'goodbye hello' },
  ]);
});
