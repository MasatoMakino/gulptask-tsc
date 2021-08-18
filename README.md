# gulptask-tsc

> TypeScript compile task for gulp.js

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Maintainability](https://api.codeclimate.com/v1/badges/84bae9c1712c6982d25b/maintainability)](https://codeclimate.com/github/MasatoMakino/gulptask-tsc/maintainability)

## Getting Started

### Install

```bash
npm install https://github.com/MasatoMakino/gulptask-tsc.git --save-dev
```

### Import

Import tasks into your `gulpfile.js`.

```gulpfile.js
const { tsc, tscClean, watchTsc } = require("gulptask-tsc").generateTasks();

exports.tsc = tsc;
exports.tscClean = tscClean;
exports.watchTsc = watchTsc;
```

## License

[MIT licensed](LICENSE).
