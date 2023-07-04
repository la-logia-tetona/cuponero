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
			try {
				const storeInput = interaction.options.getString('tienda');

				const storeIsNumber = isNumber(storeInput);

				const stores = storeIsNumber ?
					await this.storeDAO.getStoreById(storeInput) :
					await this.storeDAO.findStoreNameLike(storeInput);

				if (!stores) {
					throw new Error('Ocurrió un error al buscar las tiendas');
				}
				if (!stores.length) {
					const message = storeInput ?
						`No existen tiendas con ${storeIsNumber ? `ID **${storeInput}**` : `nombre parecido a **${storeInput}**`}`
						: 'No hay tiendas en el cuponero';
					throw new Error(message);
				}

				const message = storeInput ?
					`Tienda con ${storeIsNumber ? `ID **${storeInput}**` : `nombre parecido a **${storeInput}**`}`
					: 'Listando todas las tiendas del cuponero';
				await Command.reply(interaction, message);
				this.toReplyStrings(stores).forEach(replyString => interaction.channel.send(replyString));
			}
			catch (error) {
				Command.reply(interaction, error.message);
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