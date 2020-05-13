import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { readFileSync } from 'fs';

async function run() {
    return new Promise<void>(async (resolve, reject) => {
        const manifestPath = core.getInput('manifestPath');
        const packageName = core.getInput('packageName');

        if (manifestPath === "") {
            console.log("No manifest path provided, will use the first package from the first manifest.");
            if (packageName !== ""){
                core.setFailed("packageName can only be used if you also specify manifestPath.");
                reject("packageName provided without a manifestPath");
            }
            const globber = await glob.create(manifestPath, {followSymbolicLinks: false});
            const files = await globber.glob();
            const file = files[0];
            console.log(getManifestVersion(file));
        }
        resolve();
    });
}

const getManifestVersion = (file: string, packageName: string = ".*", ):string => {
    var version = "";
    const fileContent = readFileSync(file).toString();
    const rx = new RegExp(`<package.*name=".*${packageName}.*".*version="(.*)"`);
    const node = rx.exec(fileContent);
    console.log("Using package node: ", node);
    return node ? node.toString() : "";
}

run();

export default run;