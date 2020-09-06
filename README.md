# Codie

*This is an work in progress from a weekend project.*

The aim is to make a small interface that manages several coding project environments, using code-server.

## Install

Run:

```bash
docker run --name codie-server -v codie-proxy:/app/proxy -v codie-storage:/app/storage -v /var/run/docker.sock:/var/run/docker.sock -e PROXY_VOLUME=codie-proxy -e SERVER_LINK=codie-server -d codiecloud/codie-server
```

Then navigate to [local.codie.cloud:9876](http://local.codie.cloud:9876/) and login with admin/admin.

## What does this do exactly

Here's some features:

- Create and manage several projects, which can be reached from the main interface
- Launch a project into a code-server container
- Coding containers are automatically proxied by sub-domain. e.g. `<proxy_slug>.local.codie.cloud:9876`
- Internal server inside coding containers are automatically proxied by sub-sub-domain. e.g. `<port>.<proxy_slug>.local.codie.cloud:9876`
- Authentication required to reach sub-domains
- Initialise coding containers with with coding resources (nodejs, golang, etc...)
- Start/Stop/Restart/Remove/Rebuild Coding containers from the main interface
- Manage several users that have their own isolated projects
- User directory/profile settings shared between a user's projects

## Configuration Options

Sure!

Env Var | Default | Description
--- | ---| ---
SERVER_LINK | *required* | name of the codie-server container
PROXY_VOLUME | *required* | name of the volume that the codie-server writes it's proxy configs to
PROXY_DOMAIN | `local.codie.cloud` | domain used to access the proxy
PROXY_PORT | `9876` | exposed port for the proxy, change to 80 to not have to specify
INIT_USERNAME | `admin` | initial user username, the user is populated if the users file is empty
INIT_PASSWORD | `admin` | initial user password
CODER_IMAGE | `codercom/code-server` | image used for the coding container, roll your own!
CODER_PORT | `8080` | internal exposed port for the code server
CODER_USER | `coder` | internal user in the code container
COOKIE_NAME | `cloud.codie.local.sid` | name of the cookie used to store the session ID
COOKIE_SECRET | automatic 128-char secret | secret used for session cookie encryption

## Custom Domain

Say we want to use `example.com`.

You'll first need to create two DNS records, one for the root `example.com` and a wildcard for all sub-domains `*.example.com`, pointing to the server.

You'll then need to add the following env to the run script: `-e PROXY_DOMAIN=example.com`

Optionally you can set the port to 80 by adding the following env: `-e PROXY_PORT=80`

### Using a public IP

The domain `local.codie.cloud` and all sub-domains `*.local.codie.cloud` are set-up to point to `0.0.0.0`, also known as `localhost`.

If you want to set this up on a public IP address and work remotely. You'll need to setup a custom domain.

It is also recommended that you use https by either using Cloudflare or Let's Encrypt and another proxy.
