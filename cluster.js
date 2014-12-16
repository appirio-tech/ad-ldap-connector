var cluster = require('cluster');
var winston = require('winston');
var server = require('./server.js');
var workers = require('os').cpus().length;

winston.add(winston.transports.File, { filename: 'cluster.log' });
winston.log('info', 'starting cluster');

if (cluster.isMaster) {
    winston.info('start cluster with %s workers', workers);

    cluster.setupMaster({
        execArgv: process.execArgv.filter(function (s) {
            return s !== '--debug';
        })
    });

    for (i = 0; i < workers; i += 1) {
        curr = cluster.fork().process;
        winston.info('worker %s started.', curr.pid);
    }

    cluster.on('exit', function (worker) {
        winston.info('worker %s died. restart...', worker.process.pid);
        cluster.fork();
    });
} else {
    server.init();
}

process.on('uncaughtException', function (err) {
    winston.error('uncaught exception: ' + err);
    process.exit(1);
});