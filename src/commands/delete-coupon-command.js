const { CouponDAO } = require('../db/dao/coupon-dao');
const { Command } = require('./command');

const { CheckPermissions } = require('../utils/permissions');


class DeleteCouponCommand extends Command {
	constructor(command) {
		super(command);
		this.couponDAO = new CouponDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'borrar') {
			const { checked, checkedMessage } = CheckPermissions(interaction);
			if (!checked) {
				return Command.reply(interaction, checkedMessage);
			}
			const store = interaction.options.getString('tienda');
			const coupon = interaction.options.getString('cupon');
			const message = this.validateOptions(store, coupon);
			if (message) {
				Command.reply(interaction, message);
			}
			else {
				Command.reply(interaction, (await this.couponDAO.deleteCoupon(store, coupon)));
			}
		}
		else {
			this.nextCommand.handleInteraction(interaction);
		}
	}

	validateOptions(store, coupon) {
		if (!store || !coupon) return 'La tienda y el cupón son parámetros obligatorios';
		return null;
	}
}

exports.DeleteCouponCommand = DeleteCouponCommand;