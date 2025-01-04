# Stage 1: Building the modules
FROM node:20.15.1 as deno-builder

WORKDIR /usr/src/app

# Copying the scripts folder
COPY scripts/ ./scripts/

# Installing git
RUN apt-get update && apt-get install -y git

# Installing deno
RUN curl -fsSL https://deno.land/install.sh | sh

# Building the library Jikan.js
RUN bash ./scripts/buildJikanjs.sh

# Stage 2: Building the image
FROM node:20.15.1-alpine3.20

WORKDIR /usr/src/app

# Copying the package.json file
COPY package*.json ./

# Installing the dependencies
RUN npm install

# Copying the source code
COPY src/ ./src/

# Copying the config folder
COPY config/ ./config/

# Copying the scripts folder
COPY scripts/ ./scripts/

# Copying the Jikan.js library
COPY --from=deno-builder /usr/src/app/modules ./modules

# Checking the modules
RUN ls -la ./modules

# Exposing the default topgg webhook port
EXPOSE 3042

# Running the bot
CMD ["npm", "start"]