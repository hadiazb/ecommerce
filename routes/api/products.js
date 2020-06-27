const express = require('express');
const passport = require('passport');
const ProductsService = require('../../services/products');
const validation = require('../../utils/middlewares/validationHandlers');

const {
	productIdSchema,
	productTagSchema,
	createProductSchema,
	updateProductSchema,
} = require('../../utils/schemas/products');

// JWT Strategy
require('../../utils/auth/strategies/jwt');

function productsApi(app) {

	const router = express.Router();
	app.use('/api/products', router)
	const productsService = new ProductsService();

	router.get('/', async (req, res, next) => {
		const { tags } = req.query;
		console.log('req', req.query);
		try {
			// myUndefinedFunction();
			const products = await productsService.getProducts({
				tags,
			});

			res.status(200).json({
				data: products,
				message: 'products listed',
			});
		} catch (err) {
			next(err);
		}
	});

	router.get('/:productId', async (req, res, next) => {
		const { productId } = req.params;
		console.log('req', req.params);
		try {
			const product = await productsService.getProduct({
				productId,
			});

			res.status(200).json({
				data: product,
				message: 'product retrieved',
			});
		} catch (err) {
			next(err);
		}
	});

	router.post(
		'/',
		validation(createProductSchema),
		async (req, res, next) => {
			const { body: product } = req;

			try {
				const createProduct = await productsService.createProduct(
					{
						product,
					}
				);

				res.status(201).json({
					data: createProduct,
					message: 'product created',
				});
			} catch (error) {
				next(err);
			}
		}
	);

	router.put(
		'/:productId',
		passport.authenticate('jwt', { session: false }),
		validation({ productId: productIdSchema }, 'params'),
		validation(updateProductSchema),
		async (req, res, next) => {
			const { productId } = req.params;
			const { body: product } = req;
			console.log('req', req.params, req.body);
			try {
				const updateProduct = await productsService.updateProduct(
					{
						productId,
						product,
					}
				);

				res.status(200).json({
					data: updateProduct,
					message: 'product update',
				});
			} catch (error) {
				next(err);
			}
		}
	);

	router.delete(
		'/:productId',
		passport.authenticate('jwt', { session: false }),
		async (req, res, next) => {
			const { productId } = req.params;
			console.log('req', req.params);
			try {
				const deletedProduct = await productsService.deleteProduct(
					{
						productId,
					}
				);

				res.status(200).json({
					data: deletedProduct,
					message: 'product delete',
				});
			} catch (error) {
				next(err);
			}
		}
	);
}
module.exports = productsApi;
