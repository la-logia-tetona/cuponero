const { Command } = require('./command');

class AddStoreCommand extends Command {
	constructor(command) {
		super(command);
	}

	handleInteraction(interaction) {
		if (interaction.commandName === 'agregartienda') {
			interaction.reply('Comando no disponible')
				.then()
				.catch(console.error);
		}
		else {
			this.nextCommand.handleInteraction(interaction);
		}
	}
}

exports.AddStoreCommand = AddStoreCommand;