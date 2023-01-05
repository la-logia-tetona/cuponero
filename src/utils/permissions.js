const rolesAutorizados = ['teton cuponero'];

function CheckPermissions(interaction) {
	if (interaction.member && !(interaction.member.roles.cache.some(role => rolesAutorizados.includes(role.name.toLowerCase())))) {
		return { isChecked: false, errorMessagePermision: 'No tienes permiso para usar este comando' };
	}
	return { isChecked: true, errorMessagePermision: null };
}

exports.CheckPermissions = CheckPermissions;