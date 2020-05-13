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
const glob = __importStar(require("@actions/glob"));
const fs_1 = require("fs");
async function run() {
    const manifestPath = core.getInput('manifestPath');
    const packageName = core.getInput('packageName');
    core.group("Get Version", async () => {
        if (manifestPath === "**/*.dnn") {
            console.log("No manifest path provided, will use the first package from the first manifest.");
        }
        else {
            console.log("Trying to read from: ", manifestPath);
        }
        if (packageName !== "") {
            core.setFailed("packageName can only be used if you also specify manifestPath.");
        }
        const globber = await glob.create(manifestPath, { followSymbolicLinks: false });
        const files = await globber.glob();
        console.log("Matched manifests: ", files.join("\n"));
        const file = files[0];
        if (file === undefined) {
            core.setFailed("No manifests found!");
        }
        console.log("Using file: ", file);
        const versionString = await getManifestVersion(file);
        console.log(versionString);
    });
}
const getManifestVersion = async (file, packageName = ".*") => {
    var version = "";
    const fileContent = fs_1.readFileSync(file).toString();
    const rx = new RegExp(`<package.*name=".*${packageName}.*".*version="(.*)".*>`);
    const node = rx.exec(fileContent);
    console.log("Using package node: ", node);
    return node ? node.toString() : "";
};
run();
exports.default = run;
