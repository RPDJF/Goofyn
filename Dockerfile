FROM node:20.14.0-alpine3.19

WORKDIR /usr/src/app

# Copying the package.json file
COPY package*.json ./

# Installing the dependencies
RUN npm install

# Copying the source code
COPY src/ ./src/

# Copying the config folder
COPY config/ ./config/

# Exposing the default topgg webhook port
EXPOSE 3042
# Running the bot
CMD ["npm", "start"]