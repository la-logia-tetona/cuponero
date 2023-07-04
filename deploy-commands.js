require('dotenv').config({ path: 'deploy/.env' });
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const searchCoupons = new SlashCommandBuilder()
	.setName('ver')
	.setDescription('Ver los cupones de una tienda!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre de la tienda de la que querés ver cupones!')
			.setRequired(true));

const searchStores = new SlashCommandBuilder()
	.setName('buscar')
	.setDescription('Buscar tiendas en el cuponero!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre o parte del nombre de la tienda a buscar!')
			.setRequired(false));

const addStore = new SlashCommandBuilder()
	.setName('tienda')
	.setDescription('Agregar una nueva tienda!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre de la tienda a agregar!')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('link')
			.setDescription('Link de la tienda a agregar!')
			.setRequired(false));

const addCoupon = new SlashCommandBuilder()
	.setName('cupon')
	.setDescription('Agregar un nuevo cupón a una tienda existente!')
	.addStringOption(option =>
		option
			.setName('tienda')
			.setDescription('Nombre de la tienda a la que vas a agregar el cupón!')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('cupon')
			.setDescription('Aquí poné el cupón!')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('descripcion')
			.setDescription('Descripción del cupón, no escribas el Martín Fierro!')
			.setRequired(false))
	.addStringOption(option =>
		option
			.setName('valido')
			.setDescription('Vencimiento del cupón, si es que tiene! Formatos: DD/MM/YY, DD/MM/YYYY, DD-MM-YY o DD-MM-YYYY')
			.setRequired(false));

const commands = [
	searchStores,
	searchCoupons,
	addStore,
	addCoupon,
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);