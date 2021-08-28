const bot_msg = require('../message/bot_message.json');

module.exports = {
    name: 'move',
    execute(message) {
        const user = message.member.voice;
        const bot = message.guild.voice;

        if (!user.channel) return message.reply(bot_msg.not_channel);
        if (!bot || !bot.channelID) return message.channel.send(bot_msg.not_bot);

        message.channel.send(`:point_right: กำลังย้ายไปห้อง \`\`${user.channel.name}\`\``)
        user.channel.join();

    }
}
