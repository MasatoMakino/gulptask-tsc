"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompileTasks = void 0;
const { exec } = require("child_process");
function getCompileTasks(option) {
    const projects = option.projects;
    const tsc = () => __awaiter(this, void 0, void 0, function* () {
        const processArray = projects.map((val) => {
            return asyncExec(`npx tsc --project ${val}`);
        });
        return Promise.all(processArray);
    });
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
exports.getCompileTasks = getCompileTasks;
/**
 * child_processを実行する
 * @param command
 */
const asyncExec = (command) => {
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
const onCompleteExecTask = (error, stdout, stderr) => {
    if (error) {
        console.error(`[ERROR] ${error}`);
        return;
    }
    if (stdout)
        console.log(`stdout: ${stdout}`);
    if (stderr)
        console.log(`stderr: ${stderr}`);
};
const onStdOut = (data) => {
    let msg = Buffer.from(data, "utf-8").toString().trim();
    //FIXME : 行頭に制御文字？「c」が入ることがある。なんの意味なのか不明。本家tscにもある。
    msg = msg.replace(/^c/, "");
    if (msg === "" || msg == null)
        return;
    if (msg.includes(": error")) {
        console.error(msg);
    }
    else {
        console.log(msg);
    }
};
