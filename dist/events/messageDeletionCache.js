"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const messageCache_1 = require("./messageCache");
module.exports = {
    name: discord_js_1.Events.MessageDelete,
    once: false,
    async execute(message) {
        //console.log('messageCache: ', messageCache);
        const index = messageCache_1.messageCache.findIndex(entry => entry.messageID === message.id);
        if (index !== -1) {
            messageCache_1.messageCache[index].deleted = true;
            // remove the message from the cache
            setTimeout(() => {
                if (messageCache_1.messageCache[index].deleted) {
                    messageCache_1.messageCache.splice(index, 1);
                }
            }, 30000); // 30 seconds
        }
        //console.log('deleted message: ' + message.content);
    },
};
