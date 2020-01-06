const { exec } = require("child_process");
const path = require("path");
const { series } = require("gulp");

import { getCleanTask } from "./Clean";

/**
 * @typedef Option
 * @param {string} [project = "./tsconfig.json"]
 */
export interface Option {
  projects?: string | string[];
}

/**
 * @typedef Tasks
 * @param {Function} tsc
 * @param {Function} tscClean
 * @param {Function} watchTsc
 */
export interface Tasks {
  tsc: Function;
  tscClean: Function;
  watchTsc: Function;
}

/**
 * tsc実行タスクを取得する。
 * @param {Option} [option]
 * @return {Tasks} gulpタスク
 */
export function get(option?: Option): Tasks {
  option = initOption(option);

  const tsc = cb => {
    const callback = onCompleteExecTask(cb);
    (option.projects as string[]).forEach(val => {
      const child = exec(`npx tsc --project ${val}`, callback);
      child.stdout.on("data", onStdOut);
    });
  };

  const clear = async () => {
    for (let val of option.projects as string[]) {
      await getCleanTask(val)();
    }
  };
  const tscClean = series(clear, tsc);

  const watchTsc = () => {
    const callback = onCompleteExecTask();
    (option.projects as string[]).forEach(val => {
      const child = exec(`npx tsc -w --project ${val}`, callback);
      child.stdout.on("data", onStdOut);
    });
  };

  return {
    tsc,
    tscClean,
    watchTsc
  };
}

function initOption(option: Option) {
  if (option == null) option = {};
  if (option.projects == null) option.projects = "./tsconfig.json";

  if (!Array.isArray(option.projects)) {
    option.projects = [option.projects];
  }

  option.projects = option.projects.map(val => {
    return path.resolve(process.cwd(), val);
  });

  return option;
}

const onCompleteExecTask = (cb?: Function) => {
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
