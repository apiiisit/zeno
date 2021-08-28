const bot_msg = require('../message/bot_message.json');
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { skip, resume, pause } = require('./control');

const play = async (song, message) => {
    const song_queue = message.client.queue.get(message.guild.id);

    if (!song) {
        setTimeout(() => {
            if (song_queue.connection.dispatcher && message.guild.me.voice.channel) return;
            song_queue.channel.leave();
        }, 5 * 60 * 1000);

        message.channel.send('คิวหมดแล้ว :face_with_symbols_over_mouth:');
        return message.client.queue.delete(message.guild.id);

    }

    const yt = url => ytdl(url, { filter: 'audioonly', quality: 'lowestaudio' });
    const song_file = fs.readdirSync('./music');
    const check_song = song_file.filter(file => file === `${song.id}.mp4`);

    let stream = null;

    if (check_song[0]) {
        stream = `./music/${check_song[0]}`;
        song_queue.volume = 1;

    } else {
        stream = yt(song.url);
        yt(song.url).pipe(fs.createWriteStream(`./music/${song.id}.mp4`));

    }

    let collector = null;
    let msg = null

    song_queue.connection.play(stream, { volume: song_queue.volume })
        .on('finish', () => {
            collector.stop();

            if (song_queue.loop) {
                msg.delete({ timeout: 10000 });

                const last_song = song_queue.songs.shift();
                song_queue.songs.push(last_song);
                play(song_queue.songs[0], message);

            } else {
                song_queue.songs.shift();
                play(song_queue.songs[0], message);

            }

        })
        .on('error', err => {
            console.error(err);
            song_queue.songs.shift();
            play(song_queue.songs[0], message);

        });

    msg = await message.channel.send(`:headphones: กำลังเล่น \`\`${song.title}\`\``);

    try {
        const filter = user => user.id !== message.client.user.id;
        collector = msg.createReactionCollector(filter);

        await msg.react('⏭');
        await msg.react('▶️');
        await msg.react('⏸️');
        await msg.react('🔁');

        collector.on('collect', async (reaction, user) => {

            if (!message.member.voice.channel) return message.reply(bot_msg.not_channel);
            if (!message.guild.voice || !message.guild.voice.channelID) return message.channel.send(bot_msg.not_bot);
            if (message.member.voice.channelID != message.guild.voice.channelID) return message.reply(bot_msg.not_user_bot);
            if (!song_queue) return message.channel.send(bot_msg.not_song);

            switch (reaction.emoji.name) {
                case '⏭':
                    collector.stop();
                    skip(song_queue);
                    break;

                case '▶️':
                    msg.reactions.cache.get('⏸️').users.remove(user).catch(console.error);
                    resume(song_queue);
                    break;

                case '⏸️':
                    msg.reactions.cache.get('▶️').users.remove(user).catch(console.error);
                    pause(song_queue);
                    break;

                case '🔁':
                    reaction.users.remove(user).catch(console.error);
                    song_queue.loop = !song_queue.loop;
                    const boxmsg = new MessageEmbed()
                        .setColor('#FF00FF')
                        .setTitle('Loop')
                        .setDescription(song_queue.loop ? bot_msg.loop_enable : bot_msg.loop_disable)
                    message.channel.send(boxmsg);
                    break;

                default:
                    reaction.users.remove(user).catch(console.error);
                    break;

            }
        });

        collector.on('end', () => {
            msg.reactions.removeAll().catch(console.error);

        });

    } catch (error) {
        console.error(error);

    }

};

module.exports = play;