const play = require('../include/play');
const bot_msg = require('../message/bot_message.json');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

module.exports = {
    name: 'p',
    async execute(message, args) {
        const { channel } = message.member.voice;
        if (!channel) return message.reply(bot_msg.not_channel);
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('ขอยศหน่อย :rage:');
        if (!args.length) return;

        const search_song = async str => {
            let song_structure = null;

            const check_url = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if (!ytdl.validateURL(str) && check_url.test(str)) {
                message.reply('ได้เฉพาะลิงค์ของ YouTube :grimacing:');
                return;

            } else if (ytdl.validateURL(str)) {
                const song_info = await ytdl.getInfo(str);
                song_structure = {
                    title: song_info.videoDetails.title,
                    url: song_info.videoDetails.video_url,
                    id: song_info.videoDetails.videoId,
                    duration: parseInt(song_info.videoDetails.lengthSeconds)
                };

            } else {
                const results = await youtube.searchVideos(str, 1);
                const song_info = await ytdl.getInfo(results[0].url);
                song_structure = {
                    title: song_info.videoDetails.title,
                    url: song_info.videoDetails.video_url,
                    id: song_info.videoDetails.videoId,
                    duration: parseInt(song_info.videoDetails.lengthSeconds)
                };

            }
            return song_structure;
        }

        const song = await search_song(args.join(' '));
        if (!song) return;

        const queue_structure = {
            connection: null,
            channel,
            songs: new Array(),
            playing: true,
            volume: 0.7,
            loop: false
        }

        const song_queue = message.client.queue.get(message.guild.id);
        if (song_queue) {
            const bot = message.guild.voice;
            if (message.member.voice.channelID != bot.channelID) return message.reply(bot_msg.not_user_bot);
            song_queue.songs.push(song);
            return message.channel.send(`:musical_note: \`\`${song.title}\`\` ถูกเพิ่มแล้ว`);

        }

        message.client.queue.set(message.guild.id, queue_structure);
        queue_structure.songs.push(song);

        try {
            const connection = await channel.join();
            queue_structure.connection = connection;
            play(queue_structure.songs[0], message);

        } catch (error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send('บอทเข้าห้องไม่ได้ :cry:');

        }

    }
}
