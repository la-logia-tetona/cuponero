const { isNumber } = require('../../utils/number');
const { DAO } = require('./dao');
const { StoreDAO } = require('./store-dao');

const selectCouponsByStoreName = `
SELECT c.id, c.code, c.valid_until, c.description
FROM coupon c
JOIN public.store s ON s.id = c.store_id
WHERE lower(s.name) LIKE lower($1) AND c.deleted = false;
`;

const selectCouponsByStoreId = `
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

const findStoreWithName = `
SELECT *
FROM store s
WHERE lower(s.name) LIKE lower($1);
`;

const findStoreWithId = `
SELECT *
FROM store s
WHERE s.id = $1;
`;

const addCoupon = `
INSERT INTO coupon (store_id, code, valid_until, description) VALUES ($1,$2,$3,$4);
`;

const deleteCoupon = `
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

	async findCoupons(store, storeIsNumber) {

		const storeExist = await this.existsStore(store, storeIsNumber);
		if (!storeExist || !storeExist.length) {
			throw new Error(`No existe tienda con el ${storeIsNumber ? `ID **${store}**` : `nombre **${store}**`}`);
		}

		const coupons = storeIsNumber ?
			await this.query(selectCouponsByStoreId, [store]) :
			await this.query(selectCouponsByStoreName, [store]) ;

		if (!coupons || !coupons.length) {
			throw new Error(`No existen cupones para la tienda con ${storeIsNumber ? `ID **${store}**` : `nombre **${store}**`}`);
		}

		return { coupons: coupons.map(row => {
			row.valid_until = row.valid_until ? row.valid_until.toLocaleDateString('es-AR') : null;
			return row;
		}), storeName: storeExist[0]?.name };

	}

	async addCoupon(store, code, date = null, description = null) {
		const storeIsNumber = isNumber(store);

		const stores = storeIsNumber ?
			await this.storeDAO.getStoreById(store) :
			await this.storeDAO.findStoreByName(store);

		if (!stores || !stores.length) {
			throw new Error(`No existe tienda con el ${storeIsNumber ? 'ID' : 'nombre'} ** ${store}**`);
		}
		if (stores.length > 1) {
			throw new Error(`Existe más de una tienda con el ${storeIsNumber ? 'ID' : 'nombre'} ** ${store}**`);
		}

		const store_id = stores[0].id;

		const { errorMessage, cupon } = await this.checkIfCouponExist(store_id, code, date, description);

		if (errorMessage) {
			throw new Error(errorMessage);
		}

		if (cupon) {
			const resultRestore = await this.doRestoreCoupon(cupon.id, date, description);
			return resultRestore;
		}

		const result = await this.doAddCoupon(store_id, code, date, description);
		return result;
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
		const { errorMessage, cupon } = await this.checkIfCouponExist(store_id, code, true);

		if (!cupon) {
			if (!errorMessage) {
				throw new Error('El cupon que intentas eliminar no existe, revisa los datos e intenta nuevamente');
			}
			throw new Error(errorMessage);
		}
		const result = await this.doDeleteCoupon(cupon.id);
		return result;
	}

	async existsStore(store, storeIsNumber) {
		return storeIsNumber ?
			await this.query(findStoreWithId, [store]) :
			await this.query(findStoreWithName, [store]);
	}


	async checkIfCouponExist(store_id, code, isDeleted = false) {
		const existCoupon = await this.query(existCouponInStore, [store_id, code]);

		if (!existCoupon) {
			return { errorMessage:'Ocurrió un error al verificar los cupones de la tienda', cupon: null };
		}
		if (!existCoupon.length) {
			return { errorMessage: null, cupon: null };
		}
		if (!existCoupon[0].deleted) {
			return { errorMessage: 'Ya existe el cupón en la tienda', cupon: existCoupon[0] };
		}
		if (isDeleted && existCoupon[0].deleted) {
			return {
				errorMessage: 'El cupon ya estaba eliminado', cupon:null,
			};
		}

		return {
			errorMessage: null, cupon:existCoupon[0],
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
				'El cupon estaba eliminado, y se restauro con exito' :
				'Ocurrió un error al intentar restaurar el cupón'
		);
	}
	async doDeleteCoupon(cupon_id) {
		return (
			await this.query(deleteCoupon, [cupon_id]) ?
				'Se elimino el cupón de la tienda' :
				'Ocurrió un error al intentar eliminar el cupón'
		);
	}
}

exports.CouponDAO = CouponDAO;