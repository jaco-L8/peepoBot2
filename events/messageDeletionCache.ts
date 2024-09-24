import { Events, Message } from 'discord.js';
import { messageCache } from './messageCache';

module.exports = {
    name: Events.MessageDelete,
    once: false,
    async execute(message: Message) {
        const index = messageCache.findIndex(entry => entry.messageID === message.id);
        if (index !== -1) {
            messageCache[index].deleted = true;
            const messageID = message.id; // Capture the message ID

            // remove the message from the cache
            setTimeout(() => {
                const index = messageCache.findIndex(entry => entry.messageID === messageID);
                if (index !== -1 && messageCache[index].deleted) {
                    messageCache.splice(index, 1);
                }
            }, 30000); // 30 seconds
        }
        //console.log('deleted message: ' + message.content);
    },
};