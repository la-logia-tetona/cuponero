const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./deploy/config.json');

const buscar = new SlashCommandBuilder()
	.setName('buscar')
	.setDescription('Buscar cupones de una tienda!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre de la tienda a buscar!')
			.setRequired(true));

const agregartienda = new SlashCommandBuilder()
	.setName('agregartienda')
	.setDescription('Agregar una nueva tienda!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre de la tienda a agregar!')
			.setRequired(true));

const agregarcupon = new SlashCommandBuilder()
	.setName('agregarcupon')
	.setDescription('Agregar un nuevo cupon a una tienda!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre de la tienda a la que vas a agregar el cupon!')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('cupon')
			.setDescription('Aqui pone el cupon!')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('descripcion')
			.setDescription('Descripcion del cupon, no escribas el martin fierro!')
			.setRequired(false))
	.addStringOption(option =>
		option
			.setName('valido')
			.setDescription('Fecha de vencimiento del cupon, si es que tiene!')
			.setRequired(false));

const commands = [
	buscar,
	agregartienda,
	agregarcupon,
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);