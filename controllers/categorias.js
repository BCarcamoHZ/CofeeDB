const Categoria = require('../models/categoria');

const crearCategoria = async (rq, rs) => {
	const nombre = rq.body.nombre.toUpperCase();

	const categoriaDB = await Categoria.findOne({ nombre });
	if (categoriaDB) {
		return rs.status(400).json({
			msg: `La categoria ${categoriaDB.nombre}, ya existe`
		});
	}

	const data = {
		nombre,
		usuario: rq.authUser._id
	};

	const categoria = new Categoria(data);
	categoria.save();

	return rs.status(201).json(categoria);
};

const findAllCategories = async (rq, rs) => {
	const limit = parseInt(rq.query.limit);
	const desde = parseInt(rq.query.desde);
	const query = { estado: true };

	const [ total, categorias ] = await Promise.all([
		Categoria.countDocuments(query),
		Categoria.find(query).skip(desde).limit(limit).populate('usuario')
	]);

	rs.json({ total, categorias });
};

const findCategoryById = async (rq, rs) => {
	const { id } = rq.params;
	const category = await Categoria.findById(id).populate('usuario', 'nombre');

	return rs.json({ category });
};

const updateCategory = async (rq, rs) => {
	const { id } = rq.params;

	const nombre = rq.body.nombre.toUpperCase();
	// const estado = rq.body.estado;

	const data = {
		nombre,
		// estado,
		usuario: rq.authUser._id
	};

	try {
		const category = await Categoria.findByIdAndUpdate(id, data, { new: true }).populate('usuario');

		return rs.json(category);
	} catch (error) {
		console.log(error);
		return rs.status(500).json({
			msg: 'Ocurrio un error'
		});
	}
};

const deleteCategory = async (rq, rs) => {
	const { id } = rq.params;
	const { authUser } = rq;

	const category = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false, usuario: authUser._id },
		{ new: true }
	).populate('usuario');

	rs.json({ category, authUser });
};

module.exports = {
	crearCategorita: crearCategoria,
	findCategoryById,
	findAllCategories,
	updateCategory,
	deleteCategory
};
