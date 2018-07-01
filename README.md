# SSHamer

SSHamer is a utility for mapping failed SSH logins on a server. This is achieved by parsing the system authorisation log for SSHD entries and converting them to a leaflet.js friendly format.

## Install

```
# clone the repo
git clone https://github.com/ChampionOfGoats/sshamer.git

# change into checkout dir
cd sshamer

# install deps
npm install
```

## Usage

Configure the application, setting the following variables in .env

```
AUTHLOG=/path/to/your/auth.log

CACHEJSON=/where/to/save/cache.json

PORT=<port number to bind>

# If using a host name for `INTERFACE`, it should be present in `/etc/hosts`.
INTERFACE=<IP address or host name to bind>
```

That's it. Navigate to the IP/URL specified by `INTERFACE:PORT` and you should see.

## Debugging

SSHamer uses debug and exposes the following debug classes

```
# main application logging
sshamer:application

# auth watcher logging
sshamer:authwatcher
```

Debug logs can be enabled in one of two ways -

```
# run the application, prepending DEBUG=...
DEBUG=* node app.js

# or specify the DEBUG classes in .env
DEBUG=sshamer:*
```

## Contributing

Yes, please! I'd be particularly interested in changes to help this tool support Windows servers. Fork the repo and submit a pull request, bish bash bosh.
