async function run() {
    return new Promise<void>((resolve) => {
        console.log("Test");
        resolve();
    });
}

run();

export default run;