class Command {
	constructor(command) {
		this.nextCommand = command;
	}

	async handleInteraction(interaction) {
		console.log(interaction);
		Command.reply(interaction, 'Respuesta al comando no definida');
	}

	static async reply(interaction, content) {
		await interaction.reply(content)
			.then()
			.catch(console.err);
	}
}

exports.Command = Command;