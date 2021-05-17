const Producto = require('../models/Producto');

const createProduct = async (rq, rs) => {
	const { precio, categoria, descripcion, disponible } = rq.body;
	const nombre = rq.body.nombre.toUpperCase();

	try {
		const dbProduct = await Producto.findOne({ nombre });

		if (dbProduct) {
			return rs.status(400).json({
				msg: `El producto ${nombre} ya existe en la base de datos`
			});
		}

		const data = {
			nombre,
			usuario: rq.authUser._id,
			precio,
			categoria,
			descripcion,
			disponible
		};

		const product = new Producto(data);
		product.save();

		return rs.status(201).json({
			product
		});
	} catch (error) {
		console.log(error);
		rs.status(500).json({
			msg: 'Algo ha ido mal'
		});
	}
};

const findAllProducts = async (rq, rs) => {
	const limit = parseInt(rq.query.limit);
	const desde = parseInt(rq.query.desde);
	const query = { estado: true };

	const [ total, products ] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query).skip(desde).limit(limit).populate('usuario', 'nombre').populate('categoria', 'nombre')
	]);

	rs.json({ total, products });
};

const findProductById = async (rq, rs) => {
	const { id } = rq.params;
	const product = await Producto.findById(id).populate('categoria', 'nombre').populate('usuario', 'nombre');

	return rs.json({ product });
};

const updateProduct = async (rq, rs) => {
	const { id } = rq.params;
	const { precio, categoria, descripcion, disponible } = rq.body;

	const nombre = rq.body.nombre.toUpperCase();

	const data = {
		nombre,
		usuario: rq.authUser._id,
		precio,
		categoria,
		descripcion,
		disponible
	};

	try {
		const product = await Producto.findByIdAndUpdate(id, data, { new: true })
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre');

		return rs.json(product);
	} catch (error) {
		console.log(error);
		return rs.status(500).json({ msg: 'Algo ha ido mal' });
	}
};

const deleteProduct = async (rq, rs) => {
	const { id } = rq.params;
	const { authUser } = rq;

	const product = await Producto.findByIdAndUpdate(id, { estado: false, usuario: authUser._id }, { new: true })
		.populate('usuario', 'nombre')
		.populate('categoria', 'nombre');

	rs.json({ product, authUser });
};

module.exports = {
	createProduct,
	findAllProducts,
	findProductById,
	updateProduct,
	deleteProduct
};
