const db = require("./db");
const fs = require("fs");
const path = require("path");

const langDir = path.join(__dirname, "..", "languages");

const langFiles = fs.readdirSync(langDir).filter(file => file.endsWith(".json"));

const langCode = {};

langFiles.forEach(file => {
    const lang = require(path.join(langDir, file));
    langCode[lang.data.code] = lang;
});

langCode.default = langCode.en;

const languageData = [];

for (const lang in langCode) {
    languageData[langCode[lang].value] = langCode[lang].data;
}

/**
 * @summary Get the dictionary for the given guild or user
 * @param {{ guildid:int, userid:int }} param0 
 * @returns {Promise<Object>}
 */
async function getDictionary({ guildid, userid}) {
    let lang = langCode.default;
    const doc = guildid ? await db.getData("guilds", guildid) : await db.getData("users", userid);
    if (doc && doc.lang) {
        return (langCode[doc.lang] || lang);
    }
    return lang;
}

module.exports = {
    langCode,
    languageData,
    getDictionary,
};