const bot_msg = require('../message/bot_message.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'loop',
    execute(message) {
        const user = message.member.voice;
        const bot = message.guild.voice;
        const song_queue = message.client.queue.get(message.guild.id);

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);
        if (user.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);
        if (!song_queue) return message.channel.send(bot_msg.not_song);

        song_queue.loop = !song_queue.loop;
        const boxmsg = new MessageEmbed()
            .setColor('#FF00FF')
            .setTitle('Loop')
            .setDescription(song_queue.loop ? bot_msg.loop_enable : bot_msg.loop_disable)
        return message.channel.send(boxmsg);

    }
}
