const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const boom = require('boom');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');
const authApiRouter = require('./routes/api/auth');
const {
	logErrors,
	wrapErrors,
	clientErrorHandler,
	errorHandler,
} = require('./utils/middlewares/errorsHandlers');

const isRequestAjexOrApi = require('./utils/isRequestAjaxOrApi');

// app
const app = express();

// middleware
app.use(bodyParser.json());

// Static files
app.use(
	'/static',
	express.static(path.join(__dirname, 'public'))
);

// View engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// Routes
app.use('/products', productsRouter);
productsApiRouter(app)
app.use('/api/auth', authApiRouter);

// redirect
app.get('/', (req, res) => {
	res.redirect('/products');
});

app.use((req, res, next) => {
	if (isRequestAjexOrApi(req)) {
		const {
			output: { statusCode, payload },
		} = boom.notFound();
		res.status(statusCode).json(payload);
	}

	res.status(404).render('404');
});

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// server
const server = app.listen(process.env.PORT, () => {
	console.log(
		`Listening http://localhost:${server.address().port}`
	);
});
