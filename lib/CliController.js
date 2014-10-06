/*! Parker v0.0.0 - MIT license */

'use strict';

var util = require('util'),
    events = require('events'),
    glob = require('glob');

function CliController() {
    events.EventEmitter.call(this);
}

util.inherits(CliController, events.EventEmitter);

CliController.prototype.dispatch = function (argv) {
    if (argv.v || argv.version) {
        this.emit('showVersion');
    }
    if (argv.h || argv.help) {
        this.emit('showHelp');
    }
    if (argv.f || argv.format) {
        var format = argv.f || argv.format;
        this.emit('setFormat', format);
    }
    if (argv.n || argv.numeric) {
        this.emit('showNumericOnly');
    }
    if (argv._ && argv._.length) {
        var paths = [];

        argv._.forEach(function (arg) {
            if (isGlob(arg)) {
                glob.sync(arg).filter(function (file) {
                    return (fileIsStylesheet(file));
                }).forEach(function (file) {
                    paths.push(file);
                }, this);
            } else {
                paths.push(arg);
            }
        }, this);

        this.emit('runPaths', paths);
    }
    else if (argv.s || argv.stdin) {
        this.emit('runStdin');
    }
    else {
        // No data supplied - show help
        this.emit('showHelp');
    }
};

var isGlob = function (str) {
    return str.indexOf('*') !== -1;
};

var fileIsStylesheet = function (filePath) {
    return filePath.indexOf('.css') !== -1;
};

module.exports = CliController;