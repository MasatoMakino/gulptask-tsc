# gulptask-tsc

TypeScript compile task for gulp.js

## Getting Started

### Install

```bash
npm install https://github.com/MasatoMakino/gulptask-tsc.git --save-dev
```

### Import

Import tasks on your `gulpfile.js`.

```gulpfile.js
const { tsc, tscClean, watchTsc } = require("gulptask-tsc").get();

exports.tsc = tsc;
exports.tscClean = tscClean;
exports.watchTsc = watchTsc;
```

## License

[MIT licensed](LICENSE).
