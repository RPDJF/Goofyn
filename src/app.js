// Initiate the environment variables
require('dotenv').config();

if (!process.env.SCRIPT)
	require('./bot');
else
	require(`../scripts/${process.env.SCRIPT}`);