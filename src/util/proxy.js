/* eslint-disable max-len */

const fs = require('fs').promises;
const path = require('path');

const rootPath = path.join(__dirname, '../../');

fs.writeFile(path.join(rootPath, 'proxy/main.conf'), `
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  return 301 http://${process.env.PROXY_DOMAIN || 'local.codie.cloud'}:${process.env.PROXY_PORT || 9876}$request_uri;
}

server {
  listen 80;
  listen [::]:80;
  server_name
      ${process.env.PROXY_DOMAIN || 'local.codie.cloud'};
  location / {
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_pass http://${process.env.SERVER_LINK || 'docker-host'}:${process.env.PORT || 9002};
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_read_timeout 3m;
      proxy_send_timeout 3m;
  }

}
`);

module.exports = (slug) => fs.writeFile(path.join(rootPath, `proxy/${slug}.conf`), `
server {
  listen 80;
  listen [::]:80;
  server_name
      ${slug}.${process.env.PROXY_DOMAIN || 'local.codie.cloud'}
      *.${slug}.${process.env.PROXY_DOMAIN || 'local.codie.cloud'};
  error_page 403 http://${process.env.PROXY_DOMAIN || 'local.codie.cloud'}/login?followPath=http://${slug}.${process.env.PROXY_DOMAIN || 'local.codie.cloud'};

  location / {
      auth_request /auth;
      auth_request_set $auth_status $upstream_status;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_pass http://${slug}:${process.env.CODER_PORT || 8080};
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_read_timeout 3m;
      proxy_send_timeout 3m;
  }

  location = /auth {
    internal;
    proxy_pass              http://${process.env.SERVER_LINK || 'docker-host'}:${process.env.PORT || 9002}/api/auth/ping;
    proxy_pass_request_body off;
    proxy_set_header        Content-Length "";
    proxy_set_header        X-Original-URI $request_uri;
  }

}
`);
