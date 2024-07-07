import { Events, Message } from 'discord.js';


export interface MessageCacheEntery {
    authorID: string;
    deleted: boolean;
    message: string;
    messageID: string;
    messageTime: number;
}

// added export here to make typescript happy
export let messageCache: MessageCacheEntery[] = [];

const guildID = '1152979295128535130'; 
module.exports = {
     name: Events.MessageCreate,
     once: false,
     async execute(message: Message) {
        if (message.guild?.id == guildID && message.author.bot == false) {

            // trim the message to 1000 characters
            const MAX_MESSAGE_LENGTH = 1000;
            const trimmedMessage = message.content.length > MAX_MESSAGE_LENGTH ? 
                                message.content.substring(0, MAX_MESSAGE_LENGTH) + '...' : 
                                message.content; 


            messageCache.push(
                {
                    authorID: message.author.id,
                    deleted: false,
                    message: trimmedMessage,
                    messageID: message.id,
                    messageTime: message.createdTimestamp
                }
            );

            // setTimeout(() => {
            //     const index = messageCache.findIndex(entry => entry.messageID === message.id);
            //     if (index !== -1) {
            //         messageCache.splice(index, 1);
            //     }
            // }, 30000); // 30 seconds

            if (messageCache.length > 10) {
                messageCache.pop();
            }
            //console.log(messageCache[0]);
        }
        
    }
};

// actual export for messageCache
module.exports.messageCache = messageCache;