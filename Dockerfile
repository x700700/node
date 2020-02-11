# Use latest node
FROM node:10.16.1

# create server directory in container
RUN mkdir -p /server

# set /server directory as default working directory
WORKDIR /server

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /server/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --pure-lockfile

# copy all file from current dir to /server in container
COPY . /server/
COPY .env.prod /server/.env

# expose port 4044
EXPOSE 4044

# cmd to start service
CMD [ "yarn", "start" ]
