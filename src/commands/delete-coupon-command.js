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
			try {

				const { isChecked, errorMessagePermision } = CheckPermissions(interaction);
				if (!isChecked) {
					throw new Error(errorMessagePermision);
				}
				const store = interaction.options.getString('tienda');
				const coupon = interaction.options.getString('cupon');

				const errorMessage = this.validateOptions(store, coupon);
				if (errorMessage) {
					throw new Error(errorMessage);
				}
				const result = await this.couponDAO.deleteCoupon(store, coupon);
				Command.reply(interaction, result);
			}
			catch (error) {
				Command.reply(interaction, error.message);
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