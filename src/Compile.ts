const { exec } = require("child_process");
import { Option } from "./Option";

export interface CompileTasks {
  tsc: Function;
  watchTsc: Function;
}
export function getCompileTasks(option: Option): CompileTasks {
  const tsc = (cb) => {
    const callback = onCompleteExecTask(cb);
    (option.projects as string[]).forEach((val) => {
      const child = exec(`npx tsc --project ${val}`, callback);
      child.stdout.on("data", onStdOut);
    });
  };

  const watchTsc = async () => {
    const callback = onCompleteExecTask();
    (option.projects as string[]).forEach((val) => {
      const child = exec(`npx tsc -w --project ${val}`, callback);
      child.stdout.on("data", onStdOut);
    });
  };

  return {
    tsc,
    watchTsc,
  };
}

const asyncExec = (command: string) => {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      const exec = onCompleteExecTask();
      exec(error, stdout, stderr);
      resolve();
    });
    child.stdout.on("data", onStdOut);
  });
};

const onCompleteExecTask = (cb?: Function): Function => {
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
