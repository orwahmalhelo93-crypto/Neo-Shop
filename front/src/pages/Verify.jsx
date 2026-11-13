import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

const Verify = () => {
	const [searchParams] = useSearchParams();
	const success = searchParams.get("success");
	const orderId = searchParams.get("orderId");
	const storedToken = localStorage.getItem("token");
	const {
		url,
		clearCart,
		removeFromCart,
		setCartItems,
		token,
		getTotalCartAmount,
	} = useContext(ShopContext);
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading");

	useEffect(() => {
		if (!token) return;
		const verifyPayment = async () => {
			try {
				const res = await axios.post(`${url}/api/order/verify`, {
					success,
					orderId,
				});
				if (res.data.success) {
					await clearCart();
					setStatus("success");
					setTimeout(() => navigate("/"), 2000);
				}
				// اضافة else
				else {
					setStatus("error");
					setTimeout(() => navigate("/"), 2000);
				}
			} catch (err) {
				console.log(err);
				setStatus("error");
				setTimeout(() => navigate("/"), 2000);
			}
		};
		verifyPayment();
	}, [success, orderId, url, navigate, token]);

	return (
		<section
			className="min-h-screen flex items-center justify-center bg-linear-to-r
	from-indigo-900 via-purple-900 to-pink-900 text-white px-6"
		>
			<div className="text-center flex flex-col items-center">
				{status === "loading" && (
					<div className="flex flex-col items-center animate-pulse">
						<Loader2 className="w-20 h-20 animate-spin text-cyan-400 mb-6" />
						<h2 className="text-2xl font-semibold">
							جاري التحقق من عملية الدفع .....
						</h2>
						<p className="text-gray-300 mt-2">يرجى الانتظار قليلا ⏳</p>
					</div>
				)}
				{status === "success" && (
					<div className="flex flex-col items-center animate-pulse">
						<CheckCircle className="w-20 h-20 animate-spin text-cyan-400 mb-6" />
						<h2 className="text-2xl font-semibold">تم الدفع بنجاح</h2>
						<p className="text-gray-300 mt-2">سيتم نقلك الى طلباتك الان ...</p>
					</div>
				)}
				{status === "error" && (
					<div className="flex flex-col items-center animate-pulse">
						<XCircle className="w-20 h-20 animate-spin text-cyan-400 mb-6" />
						<h2 className="text-2xl font-semibold">فشلت عملية الدفع</h2>
						<p className="text-gray-300 mt-2">
							أثناء التحقق حدث خطأ ، سيتم اعادتك الى الصفحة الرئيسية ...
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default Verify;
