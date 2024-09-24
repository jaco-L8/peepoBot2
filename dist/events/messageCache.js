"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageCache = void 0;
const discord_js_1 = require("discord.js");
// added export here to make typescript happy
exports.messageCache = [];
const guildID = '1152979295128535130';
module.exports = {
    name: discord_js_1.Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.guild?.id == guildID && message.author.bot == false) {
            // trim the message to 500 characters
            const MAX_MESSAGE_LENGTH = 500;
            const trimmedMessage = message.content.length > MAX_MESSAGE_LENGTH ?
                message.content.substring(0, MAX_MESSAGE_LENGTH) + '...' :
                message.content;
            exports.messageCache.push({
                authorID: message.author.id,
                deleted: false,
                message: trimmedMessage,
                messageID: message.id,
                messageTime: message.createdTimestamp
            });
            // setTimeout(() => {
            //     const index = messageCache.findIndex(entry => entry.messageID === message.id);
            //     if (index !== -1) {
            //         messageCache.splice(index, 1);
            //     }
            // }, 30000); // 30 seconds
            if (exports.messageCache.length > 10) {
                exports.messageCache.shift();
            }
            //console.log(messageCache[0]);
        }
    }
};
// actual export for messageCache
module.exports.messageCache = exports.messageCache;
