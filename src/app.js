// Initiate the environment variables
require('dotenv').config();

// nasty import since Jikan.js is not yet published to npm and not even officially supported in node.js
const { JikanClient } = require("../modules/Jikan.js/npm/script/src/mod");
const jikanClient = new JikanClient();
if (!process.env.SCRIPT)
	require('./bot');
else
	require(`../scripts/${process.env.SCRIPT}`);