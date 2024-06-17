const langCode = {
    default: process.env.DEFAULT_LANG,
    en: 0,
    fr: 1,
};

const languageData = [];
languageData[langCode.en] = require("../languages/en.json");
languageData[langCode.fr] = require("../languages/fr.json");

module.exports = {
    langCode,
    languageData,
};