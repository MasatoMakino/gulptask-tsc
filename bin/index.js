"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { exec } = require("child_process");
const path = require("path");
const { series } = require("gulp");
const Clean_1 = require("./Clean");
/**
 * tsc実行タスクを取得する。
 * @param {Option} [option]
 * @return {Tasks} gulpタスク
 */
function get(option) {
    option = initOption(option);
    const tsc = cb => {
        const callback = onCompleteExecTask(cb);
        const child = exec(`npx tsc --project ${option.project}`, callback);
        child.stdout.on("data", onStdOut);
    };
    const tscClean = series(Clean_1.getCleanTask(option.project), tsc);
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
}
exports.get = get;
function initOption(option) {
    if (option == null)
        option = {};
    if (option.project == null)
        option.project = "./tsconfig.json";
    option.project = path.resolve(process.cwd(), option.project);
    return option;
}
const onCompleteExecTask = (cb) => {
    return (error, stdout, stderr) => {
        if (error) {
            console.error(`[ERROR] ${error}`);
            return;
        }
        if (stdout)
            console.log(`stdout: ${stdout}`);
        if (stderr)
            console.log(`stderr: ${stderr}`);
        if (cb)
            cb();
    };
};
const onStdOut = data => {
    let msg = Buffer.from(data, "utf-8")
        .toString()
        .trim();
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
