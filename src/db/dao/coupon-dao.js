const { isNumber } = require('../../utils/number');
const { DAO } = require('./dao');
const { StoreDAO } = require('./store-dao');

const selectCoupons = `
SELECT c.id, c.code, c.valid_until, c.description
FROM coupon c
JOIN public.store s ON s.id = c.store_id
WHERE lower(s.name) LIKE lower($1) AND c.deleted = false;
`;

const selectCouponsByID = `
SELECT c.id, c.code, c.valid_until, c.description, s.name 
FROM coupon c
JOIN public.store s ON s.id = c.store_id
WHERE s.id = $1 AND c.deleted = false;
`;

const existCouponInStore = `
SELECT c.*
FROM coupon c
JOIN store s ON s.id = c.store_id
WHERE s.id = $1 AND lower(c.code) LIKE lower($2);
`;

const existStoreWithName = `
SELECT (count(s.id) = 1) as exist
FROM store s
WHERE lower(s.name) LIKE lower($1);
`;

const existStoreWithID = `
SELECT (count(s.id) = 1) as exist
FROM store s
WHERE s.id = $1;
`;

const addCoupon = `
INSERT INTO coupon (store_id, code, valid_until, description) VALUES ($1,$2,$3,$4);
`;

const delteCoupon = `
UPDATE coupon SET deleted = true WHERE id = $1;
`;

const restoreCoupon = `
UPDATE coupon SET deleted = false, valid_until = $2, description= $3 WHERE id = $1;
`;

class CouponDAO extends DAO {
	constructor() {
		super();
		this.storeDAO = new StoreDAO();
	}

	async findCoupons(store, booleanValue) {
		const couponsResult = booleanValue ?
			await this.queryThrow(selectCouponsByID, [store]) :
			await this.queryThrow(selectCoupons, [store]) ;
		if (couponsResult.length === 0 && !(await this.existsStore(store, booleanValue))) {
			throw 'No existe tienda con el nombre ' + store;
		}
		return booleanValue ?
			{ coupons: couponsResult.map(row => {
				row.valid_until = row.valid_until ? row.valid_until.toLocaleDateString('es-AR') : null;
				return row;
			}), tiendaName: couponsResult[0].name }
			: {
				coupons: couponsResult.map(row => {
					row.valid_until = row.valid_until ? row.valid_until.toLocaleDateString('es-AR') : null;
					return row;
				}), tiendaName: null,
			};
	}

	async existsStore(store, booleanValue) {
		return booleanValue ?
			(await this.queryThrow(existStoreWithID, [store]))[0].exist :
			(await this.queryThrow(existStoreWithName, [store]))[0].exist;
	}

	async addCoupon(store, code, date = null, description = null) {
		const storeIsNumber = isNumber(store);

		const stores = storeIsNumber ?
			await this.storeDAO.getStoreById(store) :
			await this.storeDAO.findStoreByName(store);

		if (stores.length === 0) {
			return `No existe tienda con el ${storeIsNumber ? 'ID' : 'nombre'} ${store}`;
		}
		if (stores.length > 1) {
			return `Existe más de una tienda con el ${storeIsNumber ? 'ID' : 'nombre'} ${store}`;
		}

		const store_id = stores[0].id;
		const { message } = await this.checkIfCouponExist(store_id, code, date, description);
		return message ?
			message :
			await this.doAddCoupon(store_id, code, date, description);

	}

	async deleteCoupon(store, code) {
		const storeIsNumber = isNumber(store);

		const stores = storeIsNumber ?
			await this.storeDAO.getStoreById(store) :
			await this.storeDAO.findStoreByName(store);

		if (stores.length === 0) {
			return `No existe tienda con el ${storeIsNumber ? 'ID' : 'nombre'} ${store}`;
		}
		if (stores.length > 1) {
			return `Existe más de una tienda con el ${storeIsNumber ? 'ID' : 'nombre'} ${store}`;
		}

		const store_id = stores[0].id;
		const { message, cupon } = await this.checkIfCouponExist(store_id, code);
		return cupon ?
			await this.doDeleteCoupon(cupon.id) :
			message ?
				message :
				'Exploto todo :3';
	}

	async checkIfCouponExist(store_id, code, date, description) {
		const existCoupon = await this.query(existCouponInStore, [store_id, code]);
		if (!existCoupon) {
			return { message:'Ocurrió un error al verificar los cupones de la tienda', cupon: null };
		}
		if (!existCoupon.length) {
			return { message: null, cupon: null };
		}
		if (!existCoupon[0].deleted) {
			return { message: 'Ya existe el cupón en la tienda', cupon: existCoupon[0] };
		}
		const resultRestore = await this.doRestoreCoupon(existCoupon[0].id, date, description);
		return {
			message: resultRestore, cupon:null,
		};
	}

	async doAddCoupon(store_id, code, date, description) {
		return (
			await this.query(addCoupon, [store_id, code, date, description]) ?
				'Se agregó el cupón a la tienda' :
				'Ocurrió un error al intentar agregar el cupón'
		);
	}

	async doRestoreCoupon(cupon_id, date, description) {
		return (
			await this.query(restoreCoupon, [cupon_id, date, description]) ?
				'El Cupon estaba eliminado, y se restauro con exito' :
				'Ocurrió un error al intentar agregar el cupón'
		);
	}
	async doDeleteCoupon(cupon_id) {
		return (
			await this.query(delteCoupon, [cupon_id]) ?
				'Se elimino el cupón a la tienda' :
				'Ocurrió un error al intentar agregar el cupón'
		);
	}
}

exports.CouponDAO = CouponDAO;