const rolesAutorizados = ['teton cuponero'];

function CheckPermissions(interaction) {
	if (interaction.member && !(interaction.member.roles.cache.some(role => rolesAutorizados.includes(role.name.toLowerCase())))) {
		return { checked: false, checkedMessage: 'No tienes permiso para usar este comando' };
	}
	return { checked: true, checkedMessage: null };
}

exports.CheckPermissions = CheckPermissions;