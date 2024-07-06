const db = require("./db");

const langCode = {
    en: {
        value: "en",
        name: "English",
    },
    fr: {
        value: "fr",
        name: "Français",
    },
};

langCode.default = langCode.en;

const languageData = [];
languageData[langCode.en.value] = require("../languages/en.json");
languageData[langCode.fr.value] = require("../languages/fr.json");

/**
 * @summary Get the dictionary for the given guild or user
 * @param {{ guildid:int, userid:int }} param0 
 * @returns {Promise<Object>}
 */
async function getDictionary({ guildid, userid}) {
    let lang = langCode.default;
    const doc = guildid ? await db.getData("guilds", guildid) : await db.getData("users", userid);
    if (doc && doc.lang)
        lang = langCode[doc.lang] || langCode.default;
    return languageData[lang.value];
}

module.exports = {
    langCode,
    languageData,
    getDictionary,
};