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
        option.projects.forEach(val => {
            const child = exec(`npx tsc --project ${val}`, callback);
            child.stdout.on("data", onStdOut);
        });
    };
    const clear = () => __awaiter(this, void 0, void 0, function* () {
        for (let val of option.projects) {
            yield Clean_1.getCleanTask(val)();
        }
    });
    const tscClean = series(clear, tsc);
    const watchTsc = () => {
        const callback = onCompleteExecTask();
        option.projects.forEach(val => {
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
exports.get = get;
function initOption(option) {
    if (option == null)
        option = {};
    if (option.projects == null)
        option.projects = "./tsconfig.json";
    if (!Array.isArray(option.projects)) {
        option.projects = [option.projects];
    }
    option.projects = option.projects.map(val => {
        return path.resolve(process.cwd(), val);
    });
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
