const { StoreDAO } = require('../db/dao/store-dao');
const { Command } = require('./command');
const { isNumber } = require('../utils/number');

class SearchStoreCommand extends Command {
	constructor(command) {
		super(command);
		this.storeDAO = new StoreDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'buscar') {
			const storeName = interaction.options.getString('tienda');
			let stores = null;
			if (isNumber(storeName)) {
				stores = await this.storeDAO.getStoreById(storeName);
			}
			else {
				stores = await this.storeDAO.findStoreNameLike(storeName);
			}
			if (!stores) {
				Command.reply(interaction, 'Ocurrió un error al buscar las tiendas');
			}
			else if (stores.length === 0) {
				const message = isNumber(storeName) ?
					'No existen tiendas con ID ' + storeName :
					storeName ?
						'No existen tiendas con nombre parecido a ' + storeName :
						'No hay tiendas en el cuponero';
				Command.reply(interaction, message);
			}
			else {
				const message = isNumber(storeName) ?
					'Tienda con ID ' + storeName :
					storeName ?
						'Tiendas con nombre parecido a ' + storeName :
						'Listando todas las tiendas del cuponero';
				await Command.reply(interaction, message);
				this.toReplyStrings(stores).forEach(replyString => interaction.channel.send(replyString));
			}
		}
		else {
			this.nextCommand.handleInteraction(interaction);
		}
	}

	toReplyStrings(stores) {
		const replyStrings = [];
		let i = 0;
		let actualReplyString = '';
		while (stores[i]) {
			const couponString = this.parseStoreRow(stores[i]);
			if (actualReplyString.length + couponString.length >= 2000) {
				replyStrings.push(actualReplyString.slice());
				actualReplyString = '';
			}
			actualReplyString = actualReplyString.concat(couponString, '\n');
			i++;
		}
		replyStrings.push(actualReplyString);
		return replyStrings;
	}

	parseStoreRow(row) {
		let store = '(' + String(row.id) + ') **' + String(row.name) + '**';
		if (row.link) {
			store = store.concat(' | <', row.link, '>');
		}
		return store;
	}
}

exports.SearchStoreCommand = SearchStoreCommand;