require('dotenv').config();
const fs = require('fs');

const { Client, Collection } = require('discord.js');
const client = new Client();

client.queue = new Map();
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.username}`);

})

client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);

    } catch (error) {
        console.error(error);
    }

})

client.login(process.env.DISCORD_TOKEN);
