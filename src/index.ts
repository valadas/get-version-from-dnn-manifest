import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { readFileSync } from 'fs';

async function run() {
    const manifestPath = core.getInput('manifestPath');
    const packageName = core.getInput('packageName');

    core.group("Get Version", async () => {
        if (manifestPath === "**/*.dnn"){
            console.log("No manifest path provided, will use the first package from the first manifest.");
        }
        else{
            console.log("Trying to read from: ", manifestPath);
        }

        if (packageName !== ""){
            core.setFailed("packageName can only be used if you also specify manifestPath.");
        }
        const globber = await glob.create(manifestPath, {followSymbolicLinks: false});
        const files = await globber.glob();
        console.log("Matched manifests: ", files.join("\n"));
        const file = files[0];
        if (file === undefined){
            core.setFailed("No manifests found!");
        }
        console.log("Using file: ", file);
        const versionString = await getManifestVersion(file);
        console.log(versionString);
    });
}

const getManifestVersion = async (file: string, packageName: string = ".*", ) => {
    var version = "";
    const fileContent = readFileSync(file).toString();
    const rx = new RegExp(`<package.*name=".*${packageName}.*".*version="(.*)".*>`);
    const node = rx.exec(fileContent);
    console.log("Using package node: ", node);
    return node ? node.toString() : "";
}

run();

export default run;