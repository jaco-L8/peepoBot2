import { Events, Message } from 'discord.js';
import { messageCache } from './messageCache';

module.exports = {
    name: Events.MessageDelete,
    once: false,
    async execute(message: Message) {
        //console.log('messageCache: ', messageCache);
        const index = messageCache.findIndex(entry => entry.messageID === message.id);
        if (index !== -1) {
            messageCache[index].deleted = true;
            
            // remove the message from the cache
            setTimeout(() => {
                if (messageCache[index].deleted) {
                    messageCache.splice(index, 1);
                }
            }, 30000); // 30 seconds
        }
        //console.log('deleted message: ' + message.content);
    },
};