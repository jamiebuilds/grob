// @flow
'use strict';
const fs = require('fs');
const path = require('path');
const PQueue = require('p-queue');
const fastGlob = require('fast-glob');

function read(stream, onData, memo) {
  return new Promise((resolve, reject) => {
    let promises = [];
    stream.on('data', data => promises.push(onData(data)));
    stream.on('error', reject);
    stream.on('end', () => Promise.all(promises).then(resolve));
  });
}

/*::
type Opts = {
  cwd: string,
  globs: Array<string>,
  regex: RegExp,
};

type Match = {
  filePath: string,
  line: number,
  start: number,
  end: number,
  lineContents: string,
};

type Matches = Map<string, Array<Match>>;
*/

async function grob(opts /*: Opts */) /*: Promise<Matches> */ {
  let cwd = opts.cwd;
  let globs = opts.globs;
  let regex = opts.regex;
  let isGlobal = regex.global;

  let readQueue = new PQueue();
  let fileStream = fastGlob.stream(globs);
  let matches = new Map();

  await read(fileStream, async fileName => {
    await readQueue.add(async () => {
      let filePath = path.join(cwd, fileName);
      let readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
      let fileMatches = matches.get(fileName);
      let lastIndex = 0;

      await read(readStream, data => {
        let lines = data.split('\n');

        for (let index = 0; index < lines.length; index++) {
          let lineContents = lines[index];
          let line = lastIndex + index;
          let match;

          while (true) {
            match = regex.exec(lineContents);
            if (!match) break;

            let start = match.index;
            let end = match.index + match[0].length;

            if (!fileMatches) {
              fileMatches = [];
              matches.set(fileName, fileMatches);
            }

            fileMatches.push({
              filePath,
              line,
              start,
              end,
              lineContents,
            });

            if (!isGlobal) break;
          }
        }

        lastIndex += lines.length;
      });
    });
  });

  return matches;
}

module.exports = grob;
