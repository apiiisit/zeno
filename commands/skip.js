const bot_msg = require('../message/bot_message.json');

module.exports = {
    name: 'skip',
    async execute(message) {
        const user = message.member.voice;
        const bot = message.guild.voice;
        const song_queue = message.client.queue.get(message.guild.id);

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);
        if (user.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);
        if (!song_queue) return message.channel.send(bot_msg.not_song);

        if (!song_queue.playing) {
            song_queue.playing = true;
            await song_queue.connection.dispatcher.resume();
        }
        await song_queue.connection.dispatcher.end();
        message.react('⏯️');

    }
}
