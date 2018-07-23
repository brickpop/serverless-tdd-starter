let testSuites = 0

function started() {
    testSuites++
}

function completed() {
    if (--testSuites == 0) {
        setImmediate(() => process.exit(process.exitCode))
    }
}

function failed() {
    process.exitCode = 1
}

module.exports = {
    started,
    completed,
    failed
}
