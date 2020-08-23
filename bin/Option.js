"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOption = void 0;
const path = require("path");
function initOption(option) {
    var _a;
    option = option !== null && option !== void 0 ? option : {};
    option.projects = (_a = option.projects) !== null && _a !== void 0 ? _a : "./tsconfig.json";
    if (!Array.isArray(option.projects)) {
        option.projects = [option.projects];
    }
    option.projects = option.projects.map((val) => {
        return path.resolve(process.cwd(), val);
    });
    return option;
}
exports.initOption = initOption;
