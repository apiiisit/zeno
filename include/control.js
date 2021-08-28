const skip = async song_queue => {
    if (!song_queue.playing) {
        song_queue.playing = true;
        await song_queue.connection.dispatcher.resume();

    }
    await song_queue.connection.dispatcher.end();

}

const resume = async song_queue => {
    if (song_queue && !song_queue.playing) {
        song_queue.playing = true;
        await song_queue.connection.dispatcher.resume();

    }

}

const pause = async song_queue => {
    if (song_queue && song_queue.playing) {
        song_queue.playing = false;
        await song_queue.connection.dispatcher.pause();

    }

}

module.exports = {
    skip,
    resume,
    pause
};