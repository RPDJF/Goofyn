const { loggerConf } = require("../../config/logger_conf");

console.log("loggerConf", loggerConf);

module.exports = require("pino")(loggerConf);