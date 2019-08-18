/**
 * @typedef Option
 * @param {string} [project = "./tsconfig.json"]
 */
export interface Option {
    project?: string;
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
export declare function get(option?: Option): Tasks;
//# sourceMappingURL=index.d.ts.map