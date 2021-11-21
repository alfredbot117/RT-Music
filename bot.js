const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const yts = require( 'yt-search' )

const { getVoiceConnection,VoiceConnectionStatus, AudioPlayerStatus, StreamType, createAudioPlayer,joinVoiceChannel,createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_VOICE_STATES] });




client.once('ready', () => {
	console.log('Ready!');
});




var queue = [];
var stream ;

const player = createAudioPlayer();

var connection;




client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	

	

		connection = joinVoiceChannel({
				
			
			
			channelId: interaction.member.voice.channelId,
			
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
	

	


	
	if (commandName === 'play') {

		
		//play music command

		if(ytdl.validateURL(interaction.options._hoistedOptions[0].value)){
			stream = ytdl(interaction.options._hoistedOptions[0].value, { filter: 'audioonly' });
		}else {
			const r = await yts( interaction.options._hoistedOptions[0].value )
			const videos = r.videos.slice( 0 , 1 )
			videos.forEach( function ( v) {
				stream = ytdl(v.url, { filter: 'audioonly' , highWaterMark: 1<<25});
				console.log( v.url )
			} )
			
		}
		
		
		
		if(player._state.status == "playing"){
			queue.push(stream);
			
			console.log("this should come out the second time");
			
		}
		if(queue.length == 0){
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
			player.play(resource);
			connection.subscribe(player);
		}
		

		connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
			console.log('Connection is in the Ready state!');
		
		});

		await interaction.reply('Yeah gimlix, it works');	
	}else if (commandName === 'stop') {
		
		await interaction.reply('thank god you stopped this piece of shit');
	}
	
		
	
	
	
	



});
player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
	
	if(queue.length != 0 ){
		const resource = createAudioResource(queue[0], { inputType: StreamType.Arbitrary });				
		player.play(resource);
		connection.subscribe(player);
		
		queue.shift();
	}
	console.log('Audio player is in the Idle state!');
});

player.on("error", error=>{
	console.log("Audio error");
	console.log(error);
});

player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
		
	console.log('Audio player is in the Playing state!');
});


client.login(token);