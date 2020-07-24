const { series } = require("gulp");
import { getCompileTasks } from "./Compile";
import { getCleanTask } from "./Clean";
import { Option, initOption } from "./Option";

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

  const compileTasks = getCompileTasks(option);

  const clear = async () => {
    for (let val of option.projects as string[]) {
      await getCleanTask(val)();
    }
  };
  const tscClean = series(clear, compileTasks.tsc);

  return {
    ...compileTasks,
    tscClean,
  };
}
