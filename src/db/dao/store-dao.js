const { DAO } = require('./dao');

const addStore = `
INSERT INTO store (name) VALUES ($1);
`;

const addStoreWithLink = `
INSERT INTO store (name, link) VALUES ($1, $2);
`;

const getStoreById = `
SELECT * FROM store WHERE id == $1;
`;

const findStoreByName = `
SELECT * FROM store WHERE name LIKE $1;
`;

class StoreDAO extends DAO {
	constructor() {
		super();
	}

	async addStore(name) {
		return this.query(addStore, [name]);
	}

	async addStoreWithLink(name, link) {
		return this.query(addStoreWithLink, [name, link]);
	}

	async getStoreById(store_id) {
		return this.query(getStoreById, [store_id]);
	}

	async findStoreByName(store_name) {
		return this.query(findStoreByName, [store_name]);
	}
}

exports.StoreDAO = StoreDAO;