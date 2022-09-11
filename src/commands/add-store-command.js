const { StoreDAO } = require('../db/dao/store-dao');
const { isNumber } = require('../utils/number');
const { isValidHttpUrl } = require('../utils/http-url');
const { Command } = require('./command');

class AddStoreCommand extends Command {
	constructor(command) {
		super(command);
		this.addStoreDAO = new StoreDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'tienda') {
			const storeName = interaction.options.getString('tienda');
			const storeLink = interaction.options.getString('link');
			const message = this.validateOptions(storeName, storeLink);
			if (message) {
				Command.reply(interaction, message);
			}
			else {
				Command.reply(interaction, (await this.addStoreDAO.addStore(storeName, storeLink)));
			}
		}
		else {
			this.nextCommand.handleInteraction(interaction);
		}
	}

	validateOptions(name, link) {
		if (!(name)) return 'El nombre de la tienda es obligatorio';
		if (isNumber(name)) return 'El nombre de la tienda no puede contener solamente números';
		if (link !== null && !isValidHttpUrl(link)) return 'El link debe ser un link con HTTP o HTTPS válido';
		return null;
	}

}

exports.AddStoreCommand = AddStoreCommand;