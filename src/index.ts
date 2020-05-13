import * as core from '@actions/core';

async function run() {
    return new Promise<void>((resolve, reject) => {
        const manifestPath = core.getInput('manifestPath');
        const packageName = core.getInput('packageName');

        if (manifestPath === "") {
            console.log("No manifest path provided, will use the first package from the first manifest.");
            if (packageName !== ""){
                core.setFailed("packageName can only be used if you also specify manifestPath.");
                reject("packageName provided without a manifestPath");
            }
            
        }
        resolve();
    });
}

run();

export default run;