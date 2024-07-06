const langCode = {
    en: 0,
    fr: 1,
};

langCode.default = langCode[process.env.DEFAULT_LANGUAGE] || langCode.en;

const languageData = [];
languageData[langCode.en] = require("../languages/en.json");
languageData[langCode.fr] = require("../languages/fr.json");

module.exports = {
    langCode,
    languageData,
};