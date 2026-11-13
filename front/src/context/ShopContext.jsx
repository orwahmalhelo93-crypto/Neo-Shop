import { createContext, useState, useEffect, useMemo } from "react";
import { all_products } from "../assets/data";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState({});
	const url = "http://localhost:4000";
	const [allProducts] = useState(all_products);
	const [token, setToken] = useState(localStorage.getItem("token") || "");
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const savedCart = localStorage.getItem("cartItems");
		if (savedCart) {
			setCartItems(JSON.parse(savedCart));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("cartItems", JSON.stringify(cartItems));
	}, [cartItems]);

	const addToCart = async (id, quantity = 1) => {
		const productId = id.toString();
		setCartItems((prev) => ({
			...prev,
			[id]: prev[id] ? prev[id] + quantity : quantity,
		}));
		if (token) {
			await axios.post(
				`${url}/api/cart/add`,
				// { id: productId },
				{ id: productId },
				{ headers: { token } },
			);
		}
	};

	const removeFromCart = async (id, removeAll = false) => {
		setCartItems((prev) => {
			const updated = { ...prev };
			if (removeAll || updated[id] === 1) delete updated[id];
			else updated[id]--;
			return updated;
		});
		if (token) {
			try {
				await axios.post(
					`${url}/api/cart/remove`,
					// { id: productId },
					{ productId: id },
					{ headers: { token } },
				);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const clearCart = async () => {
		// if (!token) console.log("error");
		if (!token) {
			console.log("error");
			return;
		}
		try {
			const res = await axios.post(
				`${url}/api/cart/clear`,
				{},
				{ headers: { token } },
			);
			setCartItems({});
		} catch (err) {
			console.log(err);
		}
	};

	// يوجد تعديل لتحسين هذا الكود
	const getTotalCartAmount = () => {
		return Object.entries(cartItems).reduce((total, [id, qty]) => {
			const product = products.find((p) => p._id === id);
			return total + (product ? product.price * qty : 0);
		}, 0);
	};

	const fetchProductsList = async () => {
		try {
			const res = await axios.get(`${url}/api/product/list`);
			setProducts(res.data.data || []);
		} catch (err) {
			console.log(err);
			setProducts(all_products);
		}
	};

	const loadCartData = async (token) => {
		const res = await axios.post(
			url + "/api/cart/get",
			{},
			{ headers: { token } },
		);
		// السطران في الاسفل زيادة
		if (res.data.success) {
			setCartItems(res.data.cartData);
		}
	};

	useEffect(() => {
		async function loadData() {
			await fetchProductsList();
			if (localStorage.getItem("token")) {
				setToken(localStorage.getItem("token"));
				await loadCartData(localStorage.getItem("token"));
			}
		}
		loadData();
	}, []);

	// يوجد تعديل لتحسين هذا الكود
	// const value = {
	// 	all_products: allProducts,
	// 	cartItems,
	// 	addToCart,
	// 	removeFromCart,
	// 	getTotalCartAmount,
	// 	token,
	// 	setToken,
	// };
	const value = useMemo(
		() => ({
			all_products: products,
			cartItems,
			addToCart,
			removeFromCart,
			getTotalCartAmount,
			url,
			clearCart,
			setCartItems,
			token,
			setToken,
		}),
		[allProducts, cartItems, token],
	);

	return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
