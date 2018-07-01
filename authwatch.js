const Tail = require('tail').Tail;
const jsonfile = require('jsonfile');
const debug = require('debug')('authwatch');
const geoip = require('geoip-lite');

const authLogFile = '/var/log/auth.log';
const cacheFile = './cache.json';

/** regex for extracting sshd lines from auth log */
const rgx = /(?:sshd).+(?:Invalid user|Failed password).+(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)/;

const processExistingAuthLog = (cache) => {
    debug(`generating auth log cache from ${authLogFile}`);
    /** todo: process entire auth log if no cache exists */
    var lines = require('fs').readFileSync(authLogFile, 'utf-8')
    .split('\n')
    .filter(Boolean);
    lines.forEach(element => {
        debug(element);
        processAuthLogLine(element, cache);
    });
}

const getLocationFromIp = (ip) => {
    var geo = geoip.lookup(ip);
    return (geo != null) ? geo.ll : [0, 0];
}

const processAuthLogLine = (line, cache) => {
    var matches = line.match(rgx);

    if (matches != null) {
        debug('found a match!');
        var ip = matches[1]; // first capturing group is IP address
        if (ip in cache) {
            cache[ip].occurrences++;
        } else {
            cache[ip] = {
                location: getLocationFromIp(ip),
                occurrences: 1
            };
        }
    }
}

/* might extend this later */
const processAuthLogError = (error) => debug('error: ', error);

module.exports = class AuthWatcher {

    constructor() {
        this._cache = { };
        this._tail = new Tail(authLogFile);
        this._tail.on('line', (data) => processAuthLogLine(data, this._cache));
        this._tail.on('error', (error) => processAuthLogError(error));
    }

    get FailedAuthAttempts() {
        return this._cache;
    }

    load() {
        try {
            this._cache = jsonfile.readFileSync(cacheFile);
        } catch(e) {
            debug(`failed to load cache: ${e.message}`);
            processExistingAuthLog(this._cache);
            this.save();
        }
    }

    save() {
        try {
            jsonfile.writeFileSync(cacheFile, this._cache);
        } catch(e) {
            debug(`failed to save cache: ${e.message}`);
        }
    }
}
