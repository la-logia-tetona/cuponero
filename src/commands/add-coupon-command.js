const { CouponDAO } = require('../db/dao/coupon-dao');
const { Command } = require('./command');

class AddCouponCommand extends Command {
	constructor(command) {
		super(command);
		this.couponDAO = new CouponDAO();
	}

	async handleInteraction(interaction) {
		if (interaction.commandName === 'agregarcupon') {
			interaction.reply('Comando no disponible')
				.then()
				.catch(console.error);
		}
		else {
			this.nextCommand.handleInteraction(interaction);
		}
	}
}

exports.AddCouponCommand = AddCouponCommand;