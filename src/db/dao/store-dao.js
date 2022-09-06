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

const findStoreByLowerName = `
SELECT * FROM store WHERE lower(name) LIKE lower($1);
`;

const findStoreNameLike = `
SELECT * FROM store WHERE $1::text IS NULL OR lower(name) LIKE concat('%',lower($1),'%');
`;

class StoreDAO extends DAO {
	constructor() {
		super();
	}

	async addStore(name, link) {
		const storesByName = await this.query(findStoreByLowerName, [name]);
		if (storesByName && storesByName.length > 0) {
			return 'No se puede agregar una tienda con el nombre ' + name + ' ya que existe ' + storesByName[0].name;
		}
		return (link ?
			this.query(addStoreWithLink, [name, link]) :
			this.query(addStore, [name])
		) ?
			'La tienda ' + name + ' se agrego exitosamente' :
			'Ocurrio un error al agregar la tienda ' + name;
	}

	async getStoreById(store_id) {
		return this.query(getStoreById, [store_id]);
	}

	async findStoreByName(store_name) {
		return this.query(findStoreByLowerName, [store_name]);
	}

	async findStoreNameLike(store_name) {
		return this.query(findStoreNameLike, [store_name]);
	}
}

exports.StoreDAO = StoreDAO;