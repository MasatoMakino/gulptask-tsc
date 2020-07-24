const { exec } = require("child_process");
import { Option } from "./Option";

export interface CompileTasks {
  tsc: Function;
  watchTsc: Function;
}

export function getCompileTasks(option: Option): CompileTasks {
  const projects = option.projects as string[];

  const tsc = async () => {
    const processArray: Promise<null>[] = projects.map((val) => {
      return asyncExec(`npx tsc --project ${val}`);
    });
    return Promise.all(processArray);
  };

  const watchTsc = () => {
    projects.forEach((val) => {
      asyncExec(`npx tsc -w --project ${val}`);
    });
  };

  return {
    tsc,
    watchTsc,
  };
}

/**
 * child_processを実行する
 * @param command
 */
const asyncExec = (command: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      onCompleteExecTask(error, stdout, stderr);
      resolve();
    });
    child.stdout.on("data", onStdOut);
  });
};

/**
 * child_processのcallback関数
 */
const onCompleteExecTask = (error, stdout, stderr): void => {
  if (error) {
    console.error(`[ERROR] ${error}`);
    return;
  }
  if (stdout) console.log(`stdout: ${stdout}`);
  if (stderr) console.log(`stderr: ${stderr}`);
};

const onStdOut = (data) => {
  let msg = Buffer.from(data, "utf-8").toString().trim();

  //FIXME : 行頭に制御文字？「c」が入ることがある。なんの意味なのか不明。本家tscにもある。
  msg = msg.replace(/^c/, "");
  if (msg === "" || msg == null) return;

  if (msg.includes(": error")) {
    console.error(msg);
  } else {
    console.log(msg);
  }
};
