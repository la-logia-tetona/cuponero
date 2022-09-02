const { Command } = require('./command');

class NoCommand extends Command {
	constructor(command) {
		super(command);
	}

	handleInteraction(interaction) {
		console.log('No hay comando disponible para: ' + interaction.commandName);
	}
}

exports.NoCommand = NoCommand;