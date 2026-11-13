import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const { url, token } = useContext(ShopContext);

	const fetchOrders = async () => {
		try {
			const res = await axios.post(
				`
        ${url}/api/order/userorders`,
				{},
				{
					headers: {
						token,
					},
				},
			);

			const data = res.data.data;

			const ordersData = Array.isArray(data) ? data : data ? [data] : [];

			setOrders(ordersData);
		} catch (err) {
			console.error("Error fetching orders:", err);
			setOrders([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchOrders();
		} else {
			setLoading(false);
		}
	}, [token]);

	// Loading state
	if (loading) {
		return (
			<section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white px-6">
				<div className="flex flex-col items-center">
					<Loader2 className="w-20 h-20 animate-spin text-cyan-400 mb-6" />

					<h2 className="text-2xl font-semibold">Loading your orders...</h2>

					<p className="text-gray-300 mt-2">Please wait a moment</p>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 min-h-screen px-6 py-10">
			<h1 className="text-3xl font-bold text-white mt-10 mb-8 text-center">
				My Orders
			</h1>

			{orders.length === 0 ? (
				<p className="text-center text-gray-300 text-xl">No orders yet...</p>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{orders.map((order) => {
						const total =
							order.items?.reduce(
								(sum, item) => sum + item.price * (item.quantity || 1),
								0,
							) || 0;

						return (
							<div
								key={order._id}
								className="bg-gradient-to-b from-purple-800/70 to-transparent rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300"
							>
								{/* Order information */}
								<div>
									<h2 className="text-xl font-semibold mb-2 text-white">
										Order ID:{" "}
										{order._id ? order._id.slice(-6).toUpperCase() : "N/A"}
									</h2>

									<p className="mb-4 text-white">
										{order.items?.length || 0} product
										{order.items && order.items.length > 1 ? "s" : ""}
									</p>

									{/* Products */}
									<div className="space-y-2">
										{order.items?.map((item, index) => (
											<div
												key={item._id || index}
												className="flex justify-between items-center border-b border-gray-200/30 pb-2"
											>
												<div className="flex items-center gap-2">
													{item.image && (
														<img
															src={`${url}/images/${item.image}`}
															alt={item.name}
															className="w-12 h-12 object-cover rounded"
														/>
													)}

													<p className="text-white">
														{item.name} × {item.quantity || 1}
													</p>
												</div>
												<p className="font-semibold text-white">
													${(item.price * (item.quantity || 1)).toFixed(2)}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Order status and total */}
								<div className="mt-4 flex justify-between items-center">
									<span
										className={`flex items-center gap-2 font-semibold ${
											order.status === "delivered"
												? "text-green-500"
												: order.status === "pending"
													? "text-yellow-500"
													: order.status === "canceled"
														? "text-red-500"
														: "text-gray-300"
										}`}
									>
										{order.status === "delivered" && (
											<CheckCircle className="w-5 h-5" />
										)}

										{order.status === "pending" && (
											<Loader2 className="w-5 h-5 animate-spin" />
										)}

										{order.status === "canceled" && (
											<XCircle className="w-5 h-5" />
										)}

										{order.status
											? order.status.charAt(0).toUpperCase() +
												order.status.slice(1)
											: "Unknown"}
									</span>

									<span className="font-bold text-white">
										Total: ${total.toFixed(2)}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
};

export default MyOrders;
