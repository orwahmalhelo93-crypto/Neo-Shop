import productModel from "../models/productModel.js";
// import fs from "fs";

const addProduct = async (req, res) => {
	try {
		let imageData = "";
		if (req.file) {
			imageData = req.file.buffer.toString("base64");
		}
		const product = new productModel({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			category: req.body.category,
			image: imageData, // نحفظ الصورة ك base64
		});

		await product.save();
		res.json({ success: true, message: "Product Added" });
	} catch (err) {
		console.log(err);
		res.json({ success: false, message: err.message });
	}
};

const listProducts = async (req, res) => {
	try {
		const products = await productModel.find({});
		res.json({ success: true, data: products });
	} catch (err) {
		console.log(err);
		res.json({ success: false, message: err.message });
	}
};

const removeProduct = async (req, res) => {
	try {
		const product = await productModel.findById(req.body.id);
		if (!product) {
			return res.json({ success: false, message: "Product not found" });
		}
		await productModel.findByIdAndDelete(req.body.id);
		res.json({ success: true, message: "Product Removed" });
	} catch (err) {
		console.error(err);
		res.json({ success: false, message: err.message });
	}
};

export { addProduct, listProducts, removeProduct };
