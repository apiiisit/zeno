const bot_msg = require('../message/bot_message.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'q',
    execute(message) {
        const user = message.member.voice;
        const bot = message.guild.voice;
        const song_queue = message.client.queue.get(message.guild.id);

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);
        if (user.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);
        if (!song_queue) return message.channel.send(bot_msg.not_song);

        const queue = new Array();
        for (let i = 1; i < song_queue.songs.length; i++) {
            queue.push(`**${i}. **` + song_queue.songs[i].title);
        }

        if (!queue[0]) queue.push('ไม่มีคิว')

        const boxmsg = new MessageEmbed()
            .setColor('#FF00FF')
            .setTitle('Queue')
            .setDescription(queue.join('\n'))
            .addFields(
                { name: 'กำลังเล่น', value: song_queue.songs[0].title, inline: true },
                { name: 'Loop', value: song_queue.loop ? bot_msg.loop_enable : bot_msg.loop_disable }
            );
        return message.channel.send(boxmsg);

    }
}
