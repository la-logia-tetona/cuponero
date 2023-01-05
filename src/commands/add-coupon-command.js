const { CouponDAO } = require('../db/dao/coupon-dao');
const { isDate, formatDate } = require('../utils/date');
const { Command } = require('./command');

class AddCouponCommand extends Command {
	constructor(command) {
		super(command);
		this.couponDAO = new CouponDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'cupon') {
			try {
				const store = interaction.options.getString('tienda');
				const coupon = interaction.options.getString('cupon');
				const valid_until = interaction.options.getString('valido');
				const description = interaction.options.getString('descripcion');

				const errorMessage = this.validateOptions(store, coupon, valid_until);
				if (errorMessage) {
					throw new Error(errorMessage);
				}

				const formattedDate = valid_until ? formatDate(valid_until) : null;
				const sqlDate = formattedDate ? formattedDate.toSQLDate() : null;

				const result = await this.couponDAO.addCoupon(store, coupon, sqlDate, description);
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

	validateOptions(store, coupon, valid_until) {
		if (!store || !coupon) return 'La tienda y el cupón son parámetros obligatorios';
		if (valid_until && !isDate(valid_until)) return 'La fecha no está en formato válido';

		return null;
	}
}

exports.AddCouponCommand = AddCouponCommand;