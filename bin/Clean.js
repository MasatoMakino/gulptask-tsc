"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hjson = require("hjson");
const fs = require("fs");
const del = require("del");
const path = require("path");
function getBinDir(project, projectJson) {
    if (!projectJson.compilerOptions.outDir)
        return null;
    const projectDir = path.dirname(project);
    return path.resolve(projectDir, projectJson.compilerOptions.outDir);
}
exports.getBinDir = getBinDir;
/**
 * .tsbuildinfoファイルのパスを特定する。
 * outDirとrootDirのディレクトリが別階層に分かれている場合、.tsbuildinfoファイルはtsconfigディレクトリのサブディレクトリに格納されるため。
 * @param option
 * @param projectJson
 * @return {*}
 */
function initBuildInfoDir(project, projectJson) {
    const projectDir = path.dirname(project);
    if (!projectJson.compilerOptions.rootDir)
        return projectDir;
    const compilerOption = projectJson.compilerOptions;
    if (path.dirname(compilerOption.outDir) === path.dirname(compilerOption.rootDir)) {
        return projectDir;
    }
    const p = path.relative(path.dirname(projectDir, projectJson.compilerOptions.rootDir), projectDir);
    return path.resolve(projectDir, p);
}
exports.initBuildInfoDir = initBuildInfoDir;
function getCleanTask(project) {
    const projectJson = Hjson.parse(fs.readFileSync(project, "utf8"));
    const binDir = getBinDir(project, projectJson);
    const buildInfoDir = initBuildInfoDir(project, projectJson);
    return generateCleanTask(buildInfoDir, binDir);
}
exports.getCleanTask = getCleanTask;
function generateCleanTask(buildInfoDir, binDir) {
    const clean = cb => {
        const pathArray = [`${buildInfoDir}/*.tsbuildinfo`];
        if (binDir) {
            pathArray.push(`${binDir}/**/*.(d.ts|map|js|tsbuildinfo)`);
        }
        else {
            console.log("tsconfig.jsonにoutDirオプションた設定されていません。tsbuildinfo以外のファイルの削除はスキップされます。");
        }
        return del(pathArray).then(paths => {
            console.log("Files and folders that would be deleted:", paths);
            cb();
        });
    };
    return clean;
}
