# grob

> `grep`, but in JavaScript.

- Supports globs using [`fast-glob`](https://github.com/mrmlnc/fast-glob)
- Faster than `grep`™†

† Only faster than `grep` when you are already inside a Node process and would
  have to spawn a child process to run grep and then parse out the results. ††
  
†† Okay dudes I get it, you're all Really Smart® but this did make my program
  significantly faster so you can all take turns eating my ass.

## Install

```sh
yarn add [--dev] grob
```

## Example

```js
const grob = require('grob');

let matches = await grob({
  cwd: __dirname,
  globs: ['src/**/*.js', '!**/node_modules'],
  regex: /findme/,
});
// Map {
//   "src/index.js" => [{
//     filePath: "/path/to/src/index.js",
//     line: 13,
//     start: 12,
//     end: 18,
//     lineContents: 'console.log(findme);'
//   }]
//   ...
// }
```
