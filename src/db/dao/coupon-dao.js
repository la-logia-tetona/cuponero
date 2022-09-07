const { isNumber } = require('../../utils/number');
const { DAO } = require('./dao');
const { StoreDAO } = require('./store-dao');

const selectCoupons = `
SELECT c.id, c.code, c.valid_until, c.description 
FROM coupon c
JOIN public.store s ON s.id = c.store_id
WHERE lower(s.name) LIKE lower($1);
`;

const existCouponInStore = `
SELECT (count(c.id) > 0) as exist
FROM coupon c
JOIN store s ON s.id = c.store_id
WHERE s.id = $1 AND
	lower(c.code) LIKE lower($2);
`;

const addCoupon = `
INSERT INTO coupon (store_id, code, valid_until, description) VALUES ($1,$2,$3,$4);
`;

class CouponDAO extends DAO {
	constructor() {
		super();
		this.storeDAO = new StoreDAO();
	}

	async findCoupons(store) {
		const queryResult = (await this.query(selectCoupons, [store]));
		if (queryResult) {
			return queryResult.map(row => {
				row.valid_until = row.valid_until ? row.valid_until.toLocaleDateString() : null;
				return row;
			});
		}
		return null;
	}

	async addCoupon(store, code, date = null, description = null) {
		if (isNumber(store)) {
			const toAddCoupon = await this.storeDAO.getStoreById(store);
			if (toAddCoupon && toAddCoupon.length === 1) {
				return await this.doAddCoupon(store, code, date, description);
			}
			else {
				return 'No existe tienda con el id';
			}
		}
		else {
			const byName = await this.storeDAO.findStoreByName(store);
			if (!byName) {
				return 'Ocurrio un error al buscar tiendas con el nombre ' + store;
			}

			if (byName.length === 1) {
				const store_id = byName[0].id;
				const resultExistCoupon = await this.checkIfCouponExist(store_id, code);
				return resultExistCoupon ?
					resultExistCoupon :
					await this.doAddCoupon(store_id, code, date, description);
			}
			else if (byName.length === 0) {
				return 'No existe tienda con el nombre ' + store;
			}
			else {
				return 'Existe mas de una tienda con el nombre ' + store;
			}
		}
	}

	async checkIfCouponExist(store_id, code) {
		const existCoupon = await this.query(existCouponInStore, [store_id, code]);
		if (existCoupon) {
			console.log(existCoupon);
			return existCoupon[0].exist ?
				'Ya existe el cupon en la tienda' : null;
		}
		else {
			return 'Ocurrio un error al verificar los cupones de la tienda';
		}
	}

	async doAddCoupon(store_id, code, date, description) {
		return (
			await this.query(addCoupon, [store_id, code, date, description]) ?
				'Se agrego el cupon a la tienda' :
				'Ocurrio un error al intentar agregar el cupon'
		);
	}
}

exports.CouponDAO = CouponDAO;