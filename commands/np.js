const bot_msg = require('../message/bot_message.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'np',
    execute(message) {
        const user = message.member.voice;
        const bot = message.guild.voice;
        const song_queue = message.client.queue.get(message.guild.id);

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);
        if (user.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);
        if (!song_queue) return message.channel.send(bot_msg.not_song);

        const boxmsg = new MessageEmbed()
            .setColor('#FF00FF')
            .setTitle('กำลังเล่น')
            .setDescription(song_queue.songs[0].title)
            .addFields(
                { name: 'เพลงถัดไป', value: song_queue.songs[1] ? song_queue.songs[1].title : 'ไม่มีคิว' }
            );
        return message.channel.send(boxmsg);
    }
}
