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
exports.get = void 0;
const { series } = require("gulp");
const Compile_1 = require("./Compile");
const Clean_1 = require("./Clean");
const Option_1 = require("./Option");
/**
 * tsc実行タスクを取得する。
 * @param {Option} [option]
 * @return {Tasks} gulpタスク
 */
function get(option) {
    option = Option_1.initOption(option);
    const compileTasks = Compile_1.getCompileTasks(option);
    const clear = () => __awaiter(this, void 0, void 0, function* () {
        for (let val of option.projects) {
            yield Clean_1.getCleanTask(val)();
        }
    });
    //TODO remove series of gulp
    const tscClean = series(clear, compileTasks.tsc);
    return Object.assign(Object.assign({}, compileTasks), { tscClean });
}
exports.get = get;
