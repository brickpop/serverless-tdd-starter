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

function addCompletionHooks() {
    // Mocha hooks will run on the context of
    // the spec file calling this function
    before(started)
    
    after(completed)

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            failed()
        }
    })
}

module.exports = addCompletionHooks
