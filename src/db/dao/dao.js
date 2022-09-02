const { cuponeroPool } = require('../client');

class DAO {
	constructor() {
		this.pool = cuponeroPool;
	}

	async query(query, params) {
		try {
			return (await this.pool.query(query, params)).rows;
		}
		catch (err) {
			console.log(err);
			return null;
		}

	}
}

exports.DAO = DAO;