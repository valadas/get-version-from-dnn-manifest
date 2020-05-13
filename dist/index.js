"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
async function run() {
    return new Promise((resolve, reject) => {
        const manifestPath = core.getInput('manifestPath');
        const packageName = core.getInput('packageName');
        if (manifestPath === "") {
            console.log("No manifest path provided, will use the first package from the first manifest.");
            if (packageName !== "") {
                core.setFailed("packageName can only be used if you also specify manifestPath.");
                reject("packageName provided without a manifestPath");
            }
        }
        resolve();
    });
}
run();
exports.default = run;
