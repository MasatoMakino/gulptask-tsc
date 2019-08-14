const { exec } = require("child_process");
const path = require("path");
const del = require("del");
const { series } = require("gulp");
const Hjson = require("hjson");
const fs = require("fs");

/**
 * @typedef Option
 * @param {string} [project = "./tsconfig.json"]
 */

/**
 * @typedef Tasks
 * @param {Function} tsc
 * @param {Function} tscClean
 * @param {Function} watchTsc
 */

/**
 * tsc実行タスクを取得する。
 * @param {Option} [option]
 * @return {Tasks} gulpタスク
 */
module.exports = option => {
  option = initOption(option);

  const tsc = cb => {
    const callback = onCompleteExecTask(cb);
    const child = exec(`npx tsc --project ${option.project}`, callback);
    child.stdout.on("data", onStdOut);
  };

  const tscClean = series(getCleanTask(option.binDir), tsc);

  const watchTsc = () => {
    const callback = onCompleteExecTask();
    const child = exec(`npx tsc -w --project ${option.project}`, callback);
    child.stdout.on("data", onStdOut);
  };

  return {
    tsc: tsc,
    tscClean: tscClean,
    watchTsc: watchTsc
  };
};

function initOption(option) {
  if (option == null) option = {};
  if (option.project == null) option.project = "./tsconfig.json";

  option.project = path.resolve(process.cwd(), option.project);

  const projectJson = Hjson.parse(fs.readFileSync(option.project, "utf8"));
  if (projectJson.compilerOptions.outDir) {
    option.binDir = path.resolve(projectJson.compilerOptions.outDir);
  }
  return option;
}

const getCleanTask = binDir => {
  const clean = cb => {
    const pathArray = [`./*.tsbuildinfo`];
    if (binDir) {
      pathArray.push(`${binDir}/*.(d.ts|map|js|tsbuildinfo)`);
    } else {
      console.log(
        "tsconfig.jsonにoutDirオプションた設定されていません。tsbuildinfo以外のファイルの削除はスキップされます。"
      );
    }

    return del(pathArray).then(paths => {
      console.log("Files and folders that would be deleted:", paths);
      cb();
    });
  };
  return clean;
};

const onCompleteExecTask = cb => {
  return (error, stdout, stderr) => {
    if (error) {
      console.error(`[ERROR] ${error}`);
      return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.log(`stderr: ${stderr}`);
    if (cb) cb();
  };
};

const onStdOut = data => {
  let msg = Buffer.from(data, "utf-8")
    .toString()
    .trim();

  //FIXME : 行頭に制御文字？「c」が入ることがある。なんの意味なのか不明。本家tscにもある。
  msg = msg.replace(/^c/, "");
  if (msg === "" || msg == null) return;

  if (msg.includes(": error")) {
    console.error(msg);
  } else {
    console.log(msg);
  }
};
