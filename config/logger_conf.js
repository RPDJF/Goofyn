// you may want to remove transport to get the default logger with all of log details
const loggerConf = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l o",
		},
	},
};

module.exports = { loggerConf };