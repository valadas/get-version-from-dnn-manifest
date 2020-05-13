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
        if (files.length < 1){
            core.setFailed("No manifests found!");
        }
        else {
            const file = files[0];
            console.log("Using file: ", file);
            const versionString = await getManifestVersion(file, packageName);
            console.log("Found version string: ", versionString);
            if (versionString === ""){
                core.setFailed("No version found!");
            }
            else{
                const version = await getVersion(versionString);
                console.log("Returning", version);
                core.setOutput("major", version.major);
                core.setOutput("minor", version.minor);
                core.setOutput("patch", version.patch);
                core.setOutput("versionString", version.versionString);
            }
        }
    });
}

const getManifestVersion = async (file: string, packageName: string = ".*") => {
    var version = "";
    const fileContent = readFileSync(file).toString();
    const rx = new RegExp(`<package.*name=".*${packageName}.*".*version="(.*)".*>`);
    const node = rx.exec(fileContent);
    const noNodeFoundErrorMessage = "No matching node found!";
    const nodeText = node ? node[0] : noNodeFoundErrorMessage;
    if (nodeText === noNodeFoundErrorMessage){
        core.setFailed(noNodeFoundErrorMessage);
    }
    else{
        const nodeVersion = node ? node[1] : "";
        if (version = ""){
            core.setFailed("No version found on node");
        }
        return nodeVersion;
    }
    return "";
}

const getVersion = async (versionString: string) => {
    const parts = versionString.split('.');
    const version: Version = {
        major: parseInt(parts[0]),
        minor: parseInt(parts[1]),
        patch: parseInt(parts[2]),
        versionString: versionString
    };
    return version;
}

interface Version {
    major: number,
    minor: number,
    patch: number,
    versionString: string
}

run();

export default run;