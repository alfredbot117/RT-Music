const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [
	
	new SlashCommandBuilder().setName('stop').setDescription('stops bot'),
    new SlashCommandBuilder().setName('play').setDescription('Replies with user info!')
		.addStringOption(option =>option.setName('input')
		.setDescription('The input to echo back')
		.setRequired(true)),
	//commands end here

]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();