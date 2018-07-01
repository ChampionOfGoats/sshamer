/**
* SSHamer
* A utility for mapping failed SSH logins
* Server entry point
*/

require('dotenv').config();

/** modules */
const express = require('express');
const debug = require('debug')('sshamer:application');
const path = require('path');

debug('starting auth watch');
const authWatcher = new (require('./authwatch.js'))();
authWatcher.load();

debug('registering signal handlers');
process.on('SIGTERM', () => { process.exit(); });
process.on('SIGINT', () => { process.exit(); });
process.on('exit', () => {

    /* perform shutdown logic here */
    debug('intercepted signal - shutting down gracefully')
    authWatcher.save();
});

debug('configuring server');
const app = express();
app.use('/', express.static(path.join(__dirname, './static')));
require('./routes.js')(app, authWatcher);
app.listen({
    host: process.env.INTERFACE,
    port: process.env.PORT
}, () => debug(`listening on ${process.env.INTERFACE}:${process.env.PORT}`));
