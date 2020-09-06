FROM node:alpine

ENV NODE_ENV=production

# Create app directory
WORKDIR /app

RUN apk --no-cache --virtual build-dependencies add python g++ make

# Install app dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

RUN apk del build-dependencies

# Bundle app source
COPY . /app/

EXPOSE 9002
CMD [ "node", "app.js" ]