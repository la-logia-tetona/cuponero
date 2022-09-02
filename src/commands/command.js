class Command {
	constructor(command) {
		this.nextCommand = command;
	}

	async handleInteraction(interaction) {
		console.log(interaction);
		interaction.reply('Respuesta al comando no definida')
			.then()
			.catch(console.err);
	}
}

exports.Command = Command;