/**
* SSHamer
* A utility for mapping failed SSH logins
* Server routing
*/

module.exports = (e, aw) => {

    e.get('/raw', (req, res) => {
        res.status(200).json(aw.FailedAuthAttempts);
    });
}
