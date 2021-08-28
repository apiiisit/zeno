const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    async execute(message) {

        const commands = `
            **.p**      Play song (Song name, Song URL)
            **.np**     Now Playing
            **.q**      Song Queue
            **.loop**   Loop song
            **.pause**  Pause song
            **.resume** Resume song
            **.skip**   Skip song
            **.move**   Move a bot to the channel
            **.clear / .clear all** Remove song from queue
            **.leave**  Bot leave channel
            **.covid**  COVID-19 in Thailand now
        `
        const boxmsg = new MessageEmbed()
            .setColor('#FF00FF')
            .setTitle('HELP')
            .setURL('https://github.com/apsnlc/zeno/blob/main/README.md')
            .addField('Commands', commands, true)
            .setFooter('@ github: https://github.com/apsnlc/zeno');

        return message.channel.send(boxmsg);

    }

}
