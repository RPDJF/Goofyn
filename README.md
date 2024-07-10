<div align="center">
  <br>
  <h2> Buy me a coffee ☕ </h2>
  <a href="https://ko-fi.com/rpdjf"> <img align="center" src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3" height="50" width="210" alt="rpdjf" /></a>
  <br><br>
</div>

![](https://img.shields.io/github/languages/code-size/rpdjf/Goofyn?color=5BCFFF)

# Goofyn Discord Bot 🤖✨
Unleash the power of AI in your Discord server with Goofyn, the versatile bot that's easy to expand and customize! Built with JS and harnessing the discord.js library, it's a breeze to add new commands or features.

## Cool Features 🚀
- [x] Smart Chatbot: Engage in witty banter or get assistance.
- [x] Highly Customizable: Tailor the bot to your server's needs.
- [x] Easy to Use: Simple commands for all your needs.
- [x] Come on, it's open-source!

## Handy Commands 🛠️
- [x] /ping: Check the bot's response time.
- [x] /ask: Inquire anything, get answers.
- [x] /language: Change the bot's language.
- [x] /welcome: Set up a welcome message for new members.
- [x] /autorole: Assign roles automatically as members join.
- [x] /reactionrole: Set up roles with reactions for members to choose.
- [x] /embed: Powerful tool to create and edit bot embeds.
- [x] /message: Create and manage messages.
- [x] /invite: Get the bot's invite link.
- [x] /interaction: Interact with your friends.
- And more to come!

## Text formatting 📝
Goofyn supports text formatting in any messages and embeds.

You can use them for welcome messages for example :
- `{user}` - User mention
- `{username}` - User name
- `{userid}` - User ID
- `{guild}` - Guild name
- `{channel}` - Channel mention
- `{bot}` - Bot mention
- `{botname}` - Bot name
- `{membercount}` - Member count
- `{rolecount}` - Role count
- `{backsplash}` - `\`
- `\n` - New line

## Quick Start Guide 🏁
### Invite the Bot
Get Goofyn on your server with a simple click [here](https://discord.com/oauth2/authorize?client_id=1251221585981997126).

### Self-Hosting 🏠

#### Docker (official image)
1. Clone and navigate to the repository.
```bash
git clone https://github.com/RPDJF/Goofyn.git
cd Goofyn
```

2. Copy the ``env.example`` file to ``.env`` and fill in the required fields.
```bash
cp env.example .env
vim .env
```

3. Compose the Docker container.
```bash
docker compose up -d
```

#### Docker build image

Same as above but use docker-compose-build.yml instead

It will build the image from the Dockerfile, using the local repository
```bash
docker compose -f docker-compose-build.yml up --build -d
```

#### Manual Installation
##### Prerequisites
- [Node.js](https://nodejs.org) v20.15.1 (LTS) or higher

Same as above but without docker compose

Use this command to start the bot
```bash
npm install
npm start
```

## Scripts 📜
- ``firestore2mongo``: Migrate data from Firestore to MongoDB.
To use this script, define `SCRIPT` env to firestore2mongo and bind firebase-key.json to /config folder.

You can also use the `docker-compose.yml` file to run the bot with the script by uncommenting the script line.


## Make It Yours 🎨
Tweak bot/command settings via ``.env`` file and ``/config`` folder for a personalized touch.

Just copy the code above to get started! 🎈👾

## Contributing 🤝
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

One very appreciated contribution would be to add more languages to the chatbot. You can do this by copying one of the existing language files in the ``/languages`` folder (en.json by default) and translating the strings.

## License 📝
This project is licensed under the [MIT](https://github.com/RPDJF/Goofyn/blob/main/LICENCE.md).

This means you can use, modify, and distribute the code as you see fit, but you must include the original copyright and license.

## Acknowledgements 🙏
- [discord.js](https://discord.js.org)
- [MongoDB](https://www.mongodb.com)
- [Google Gemini](https://ai.google.dev)
- [Node.js](https://nodejs.org)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Contact 📧
For inquiries, reach out to [email](mailto:contact@ruinfo.ch).

You can also find me on Discord @Banatawa.