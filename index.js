require('dotenv').config({ path: 'deploy/.env' });

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { AddCouponCommand } = require('./src/commands/add-coupon-command');
const { AddStoreCommand } = require('./src/commands/add-store-command');
const { NoCommand } = require('./src/commands/no-command');
const { SearchCommand } = require('./src/commands/search-command');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandHandler =
new SearchCommand(
	new AddCouponCommand(
		new AddStoreCommand(
			new NoCommand(null))));

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	commandHandler.handleInteraction(interaction);
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);