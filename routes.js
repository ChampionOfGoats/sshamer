/** sshamer routing script */
module.exports = (e, aw) => {

    e.get('/raw', (req, res) => {
        res.status(200).json(aw.FailedAuthAttempts);
    });
}
