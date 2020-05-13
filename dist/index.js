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
        if (files.length < 1) {
            core.setFailed("No manifests found!");
        }
        const file = files[0];
        console.log("Using file: ", file);
        const versionString = await getManifestVersion(file);
        console.log("Found version string: ", versionString);
        if (versionString === "") {
            core.setFailed("No version found!");
        }
        const version = await getVersion(versionString);
        console.log("Returning", version);
        core.setOutput("major", version.major);
        core.setOutput("minor", version.minor);
        core.setOutput("patch", version.patch);
        core.setOutput("versionString", version.versionString);
    });
}
const getManifestVersion = async (file, packageName = ".*") => {
    var version = "";
    const fileContent = fs_1.readFileSync(file).toString();
    const rx = new RegExp(`<package.*name=".*${packageName}.*".*version="(.*)".*>`);
    const node = rx.exec(fileContent);
    const noNodeFoundErrorMessage = "No matching node found!";
    const nodeText = node ? node[0] : noNodeFoundErrorMessage;
    if (nodeText === noNodeFoundErrorMessage) {
        core.setFailed(noNodeFoundErrorMessage);
    }
    else {
        const nodeVersion = node ? node[1] : "";
        if (version = "") {
            core.setFailed("No version found on node");
        }
        return nodeVersion;
    }
    return "";
};
const getVersion = async (versionString) => {
    const parts = versionString.split('.');
    const version = {
        major: parseInt(parts[0]),
        minor: parseInt(parts[1]),
        patch: parseInt(parts[2]),
        versionString: versionString
    };
    return version;
};
run();
exports.default = run;
