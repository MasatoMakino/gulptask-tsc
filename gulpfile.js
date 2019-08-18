const { tscClean, tsc, watchTsc } = require("./bin").get({
  project: "./tsconfig.json"
});
exports.tsc = tsc;
exports.tscClean = tscClean;
exports.watchTsc = watchTsc;
