#!/usr/bin/env node

const {app} = require("../lib/cli/index.js");

app.run().then((res) => {
    if(!res) {
        return;
    }

    process.stdout.write(res);
    process.stdout.write("\n");
}).catch((err) => {
    process.stderr.write(err.message);
});
