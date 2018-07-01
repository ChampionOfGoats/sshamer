/*****************************
 * 
 */

/** modules */
const express = require('express');
const debug = require('debug')('app');
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
app.listen(3000, () => debug('listening on port 3000'));
