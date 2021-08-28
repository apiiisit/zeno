const bot_msg = require('../message/bot_message.json');

module.exports = {
    name: 'leave',
    execute(message) {
        const user = message.member.voice;
        const bot = message.guild.voice;

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);
        if (user.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);

        message.client.queue.delete(message.guild.id);
        user.channel.leave();
        message.react('👋');
    }
}
