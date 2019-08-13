const { tscClean, tsc, watchTsc } = require("./index")({
  project: "./tsconfig.sample.json"
});
exports.tsc = tsc;
exports.tscClean = tscClean;
exports.watchTsc = watchTsc;
