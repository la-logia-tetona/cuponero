const { CouponDAO } = require('../db/dao/coupon-dao');
const { Command } = require('./command');

class SearchCouponCommand extends Command {
	constructor(command) {
		super(command);
		this.couponDAO = new CouponDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'ver') {
			const storeName = interaction.options.getString('tienda');
			try {
				const coupons = await this.couponDAO.findCoupons(storeName);
				if (coupons.length === 0) {
					Command.reply(interaction, 'No hay cupones para la tienda ' + storeName);
				}
				else {
					await Command.reply(interaction, 'Cupones de **' + storeName + '**');
					this.toReplyStrings(coupons).forEach(replyString => interaction.channel.send(replyString));
				}
			}
			catch (err) {
				Command.reply(interaction, err);
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
		let coupon = '(' + String(row.id) + ') **' + String(row.code) + '**';
		if (row.valid_until) {
			coupon = coupon.concat(' | ', row.valid_until);
		}
		if (row.description) {
			coupon = coupon.concat(' | ', row.description);
		}
		return coupon;
	}
}

exports.SearchCouponCommand = SearchCouponCommand;