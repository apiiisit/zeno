const bot_msg = require('../message/bot_message.json');

module.exports = {
    name: 'clear',
    execute(message, args) {
        const user = message.member.voice;
        const bot = message.guild.voice;
        const song_queue = message.client.queue.get(message.guild.id);

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);
        if (user.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);
        if (!song_queue) return message.channel.send(bot_msg.not_song);

        if (song_queue.songs.length <= 1) return message.channel.send('ไม่มีคิวให้ลบแล้ว :face_with_symbols_over_mouth:');

        if (!args.length) {
            song_queue.songs.pop();
            message.channel.send('ลบคิวล่าสุดออก :scissors:');
        }
        else if (args[0].toLowerCase() === 'all') {
            song_queue.songs = [song_queue.songs[0]];
            message.channel.send('ลบคิวออกทั้งหมด :scissors:');
        }

    }
}
