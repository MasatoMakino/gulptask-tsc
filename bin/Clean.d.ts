export declare function getBinDir(project: string, projectJson: any): string;
/**
 * .tsbuildinfoファイルのパスを特定する。
 * outDirとrootDirのディレクトリが別階層に分かれている場合、.tsbuildinfoファイルはtsconfigディレクトリのサブディレクトリに格納されるため。
 * @param option
 * @param projectJson
 * @return {*}
 */
export declare function initBuildInfoDir(project: string, projectJson: any): string;
export declare function getCleanTask(project: string): Function;
//# sourceMappingURL=Clean.d.ts.map