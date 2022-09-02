const { CouponDAO } = require('../db/dao/coupon-dao');
const { Command } = require('./command');

class SearchCommand extends Command {
	constructor(command) {
		super(command);
		this.searchDAO = new CouponDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'buscar') {
			const storeName = interaction.options.getString('tienda');
			const coupons = await this.searchDAO.findCoupons(storeName);
			if (!coupons) {
				interaction.reply('Ocurrio un error al obtener los cupones para ' + storeName)
					.then()
					.catch(console.error);
				return;
			}
			if (coupons.length === 0) {
				interaction.reply('No hay cupones para la tienda ' + storeName)
					.then()
					.catch(console.error);
			}
			else {
				const replyStrings = this.toReplyStrings(coupons);
				interaction.reply('Cupones de **' + storeName + '**')
					.then()
					.catch(console.error);
				replyStrings.forEach(replyString => interaction.channel.send(replyString));
			}
		}
		else {
			this.nextCommand.handleInteraction(interaction);
		}
	}

	toReplyStrings(coupons) {
		const replyStrings = [];
		let i = 0;
		let actualReplyString = '';
		while (coupons[i]) {
			const couponString = this.parseCouponRow(coupons[i]);
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

	// (13) CUPONSTAR2022
	// (13) CUPONSTAR2022 | 9/5/2022
	// (13) CUPONSTAR2022 | descripcion
	// (13) CUPONSTAR2022 | 9/5/2022 | descripcion
	parseCouponRow(row) {
		let coupon = '(' + String(row.id) + ') ' + String(row.code);
		if (row.valid_until) {
			coupon = coupon.concat(' | ', row.valid_until);
		}
		if (row.description) {
			coupon = coupon.concat(' | ', row.description);
		}
		return coupon;
	}
}

exports.SearchCommand = SearchCommand;