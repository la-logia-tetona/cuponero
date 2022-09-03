class Command {
	constructor(command) {
		this.nextCommand = command;
	}

	async handleInteraction(interaction) {
		console.log(interaction);
		Command.reply(interaction, 'Respuesta al comando no definida');
	}

	static reply(interaction, content) {
		interaction.reply(content)
			.then()
			.catch(console.err);
	}
}

exports.Command = Command;