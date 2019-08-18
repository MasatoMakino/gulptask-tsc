const { tscClean, tsc, watchTsc } = require("./bin")({
  project: "./tsconfig.json"
});
exports.tsc = tsc;
exports.tscClean = tscClean;
exports.watchTsc = watchTsc;
