const { tsc, watchTsc } = require("./index")({
  project: "./tsconfig.sample.json"
});
exports.tsc = tsc;
exports.watchTsc = watchTsc;
