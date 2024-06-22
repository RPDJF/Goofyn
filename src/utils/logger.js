const { loggerConf } = require("../../config/logger_conf");

module.exports = require("pino")(loggerConf);