const { tscClean, tsc, watchTsc } = require("./").get({
  projects: ["./tsconfig.json", "./tsconfig.esm.json"]
});
exports.tsc = tsc;
exports.tscClean = tscClean;
exports.watchTsc = watchTsc;
