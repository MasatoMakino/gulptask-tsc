const path = require("path");

/**
 * @typedef Option
 * @param {string} [project = "./tsconfig.json"]
 */
export interface Option {
  projects?: string | string[];
}

export function initOption(option: Option) {
  option = option ?? {};
  option.projects = option.projects ?? "./tsconfig.json";

  if (!Array.isArray(option.projects)) {
    option.projects = [option.projects];
  }

  option.projects = option.projects.map((val) => {
    return path.resolve(process.cwd(), val);
  });

  return option;
}
