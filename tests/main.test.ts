import { it, describe } from 'vitest';
import { db } from './mocks/db';

describe('group', () => {
	it('should', () => {
		const product = db.product.create({ name: 'Apple' });
		console.log(product);
		console.log(db.product.getAll()); // Get's everything in our db
		console.log(`Number of items in the db: ${db.product.count()}`); // Count everything in our db
		console.log(db.product.delete({ where: { id: { equals: product.id } } })); // Delete one item in our db
		// console.log(`Number of items in the db: ${db.product.deleteMany()}`); // Delete everything in our db
	});
});
